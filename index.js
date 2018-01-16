#!/usr/bin/env node

const fs = require('fs');
const sourceMap = require('source-map');
const byline = require('byline')
const readline = require('readline');


function onError(err) {
  console.error(err.message || err);
  process.exit(1);
}

// Find sourceMap path from the input
const inputSourceMapName = [...process.argv].filter((name = '') => name.includes('.map'))[0];

if (!inputSourceMapName) {
  onError(new Error(`You must specify an input sourceMaps
  Ex: parseSourceMaps app.js.map and add sdtin < tests/index.txt `));
}

const stream = byline.createStream(process.stdin);

try {
  const content = fs.readFileSync(inputSourceMapName, 'utf8') || '{}';
  const smc = new sourceMap.SourceMapConsumer(JSON.parse(content));

  stream.on('data', function(line) {
    readline.clearLine(process.stdout, 0)
    readline.cursorTo(process.stdout, 0);
    const row = line.toString();
    if (!row) {
      process.stdout.write(row);
    } else {
      // Filter and cast line and column as number as the lib don't work with strings
      const [line, column] = row.split(':').filter(Number).map(Number);
      const pos = smc.originalPositionFor({ line, column }) || {};

      // Returning raw input if there is no match
      const key = (pos.source) ? `${pos.source}:${pos.line}:${pos.column}` : `${row}`;

      process.stdout.write(`${row} -> ${key}`);
    }
  });
} catch (e) {
  onError(e);
}
