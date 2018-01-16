#!/usr/bin/env node
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var fs = require('fs');
var sourceMap = require('source-map');
var byline = require('byline');
var readline = require('readline');

function onError(err) {
  console.error(err.message || err);
  process.exit(1);
}

// Find sourceMap path from the input
var inputSourceMapName = [].concat(_toConsumableArray(process.argv)).filter(function () {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return name.includes('.map');
})[0];

if (!inputSourceMapName) {
  onError(new Error('You must specify an input sourceMaps\n  Ex: parseSourceMaps app.js.map and add sdtin < tests/index.txt '));
}

var stream = byline.createStream(process.stdin);

try {
  (function () {
    var content = fs.readFileSync(inputSourceMapName, 'utf8') || '{}';
    var smc = new sourceMap.SourceMapConsumer(JSON.parse(content));

    stream.on('data', function (line) {
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      var row = line.toString();
      if (!row) {
        process.stdout.write(row);
      } else {
        // Filter and cast line and column as number as the lib don't work with strings
        var _row$split$filter$map = row.split(':').filter(Number).map(Number),
            _row$split$filter$map2 = _slicedToArray(_row$split$filter$map, 2),
            _line = _row$split$filter$map2[0],
            column = _row$split$filter$map2[1];

        var pos = smc.originalPositionFor({ line: _line, column: column }) || {};

        // Returning raw input if there is no match
        var key = pos.source ? pos.source + ':' + pos.line + ':' + pos.column : '' + row;

        process.stdout.write(row + ' -> ' + key);
      }
    });
  })();
} catch (e) {
  onError(e);
}
