const byline = require('byline');
const readline = require('readline');

/**
 * Convert a line from a stacktrace to the matching one via its sourcemap
 * Write the output to stdout
 * @param  {Object} sourceMaps Map of parsed source maps
 * @param  {String} row        Current row parsed (stacktrace line)
 */
const formatItem = (sourceMaps, key) => {
    const [name] = key.split('.');
    const sourceMapApp = sourceMaps[name];

    if (!key || !sourceMapApp) {
        return { key };
    }

    // Filter and cast line and column as number as the lib don't work with strings
    const [line, column] = key
        .split(':')
        .filter(Number)
        .map(Number);
    const pos = sourceMapApp.originalPositionFor({ line, column }) || {};

    // Returning raw input if there is no match
    const value = pos.source ? `${pos.source}:${pos.line}:${pos.column}` : `${key}`;
    return { key, value };
};

const write = ({ key = '', value = '' }) => {
    const output = !value ? key : `${key} -> ${value}`.trim();
    process.stdout.write(output);
};

/**
 * Read a file line by line to convert minify error to
 * something we can debug thx to the related sourcemap
 * @param  {Object} sourceMapApp Map of sourcemaps parsed
 * @param  {String} type         Type of parsing default is line by line from stdin
 */
const convertLog = (sourceMapApp, type = 'line') => {
    const stream = byline.createStream(process.stdin);
    stream.on('data', function(line) {
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);

        if (type === 'line') {
            write(formatItem(sourceMapApp, line.toString()));
        }

        if (type === 'stacktrace') {
            const str = line.toString();
            // Extract the error message
            const [message] = str.match(/(?:(?!\(http).)*/i) || [];

            process.stdout.write(message);
            process.stdout.write('\n');

            // The stacktrace is one line
            str.match(/((appLazy|app)\.\w+\.js:\d+:\d+)/g).forEach((row) => {
                write(formatItem(sourceMapApp, row));
                process.stdout.write('\n');
            });
        }
    });
};

/**
 * Translate a stracktrace to a dev stacktrace based on the sourceMap
 * @param  {String} body
 * @param  {Object} sourceMapApp { name:String: sourceMap:Object }
 * @return {String}              translated sourcemap
 */
function convert(body = '', sourceMapApp) {
    const lines = body.split('\n');
    const output = lines
        .reduce((acc, line) => {
            const str = line.toString();
            // Extract the error message
            const [message = ''] = str.match(/(?:(?!\(http).)*/i) || [];

            // The stacktrace is one line
            const matches = str.match(/((appLazy|app)\.\w+\.js:\d+:\d+)/g) || [];
            const list = matches.map((row) => formatItem(sourceMapApp, row));

            // Format the message when we translate the url inside
            const info = list.reduce(
                (acc, { key, value }) => {
                    if (acc.message.includes(key)) {
                        acc.message = acc.message
                            .replace(/(https:\/\/.+)app/, 'app')
                            .replace(key, value)
                            .replace(/ at /g, '\nat ');
                        return acc;
                    }

                    // Push translated value
                    acc.list.push(value);
                    return acc;
                },
                { message, list: [] }
            );
            return acc.concat([info.message].concat(info.list));
        }, [])
        .join('\n');
    return output;
}

module.exports = { convertLog, convert };
