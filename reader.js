#!/usr/bin/env node

const extract = require('./src/extract').convertLog;
const loadSources = require('./src/loadSources').read;

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
