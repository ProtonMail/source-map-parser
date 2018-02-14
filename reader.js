#!/usr/bin/env node

const extract = require('./src/extract');
const loadSources = require('./src/loadSources');

function onError(err) {
  console.error(err.message || err);
  process.exit(1);
}

try {
  const map = loadSources();
  extract(map, 'stacktrace');
} catch (e) {
  onError(e);
}
