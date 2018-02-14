const byline = require('byline')
const readline = require('readline');

/**
 * Convert a line from a stacktrace to the matching one via its sourcemap
 * Write the output to stdout
 * @param  {Object} sourceMaps Map of parsed source maps
 * @param  {String} row        Current row parsed (stacktrace line)
 */
const write = (sourceMaps, row) => {
  const [ name ] = row.split('.');
  const sourceMapApp = sourceMaps[name];

  if (!row || !sourceMapApp) {
    process.stdout.write(row);
  } else {
    // Filter and cast line and column as number as the lib don't work with strings
    const [line, column] = row.split(':').filter(Number).map(Number);
    const pos = sourceMapApp.originalPositionFor({ line, column }) || {};

    // Returning raw input if there is no match
    const key = (pos.source) ? `${pos.source}:${pos.line}:${pos.column}` : `${row}`;
    process.stdout.write(`${row} -> ${key}`.trim());
  }
};

/**
 * Read a file line by line to convert minify error to
 * something we can debug thx to the related sourcemap
 * @param  {Object} sourceMapApp Map of sourcemaps parsed
 * @param  {String} type         Type of parsing default is line by line from stdin
 */
const processor = (sourceMapApp, type = 'line') => {
  const stream = byline.createStream(process.stdin);
  stream.on('data', function(line) {
    readline.clearLine(process.stdout, 0)
    readline.cursorTo(process.stdout, 0);

    if (type === 'line') {
      write(sourceMapApp, line.toString());
    }

    if (type === 'stacktrace') {
      const str = line.toString();
      // Extract the error message
      const [ message ] = str.match(/(?:(?!\(http).)*/i) || [];
      process.stdout.write(message);
      process.stdout.write('\n');

      // The stacktrace is one line
      str.match(/((appLazy|app)\.\w+\.js:\d+:\d+)/g)
        .forEach((row) => {
          write(sourceMapApp, row);
          process.stdout.write('\n');
        });
    }

  });
}

module.exports = processor;