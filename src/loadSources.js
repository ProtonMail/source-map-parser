const fs = require('fs');
const sourceMap = require('source-map');

// Find sourceMap path from the input
const listFromArgs = () => [...process.argv].filter((name = '') => name.includes('.map'));

const read = () => readder(listFromArgs());

function readder(list = [], mapContent = {}) {
    if (!list.length) {
        throw new Error(
            `You must specify an input sourceMaps Ex: parseSourceMaps app.js.map and add sdtin < tests/index.txt `
        );
    }

    return list.reduce((acc, key) => {
        const [name] = key.split('.');

        // debug purpose, we convert stactrace ;)
        const [app] = name.match(/(appLazy|app|stacktrace)/) || [];
        const mapName = app === 'stacktrace' ? 'appLazy' : app;
        const content = mapContent[mapName] || fs.readFileSync(key, 'utf8') || '{}';
        const smc = new sourceMap.SourceMapConsumer(JSON.parse(content));
        acc[mapName] = smc;
        return acc;
    }, {});
}

module.exports = { read, readder };
