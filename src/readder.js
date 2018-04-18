const { convert } = require('./extract');
const { readder } = require('./loadSources');
const noop = async () => {};

const getURL = (body) => {
    const list = body.split('https') || [];
    const str = list.find((item) => /(:\/\/.+\.js):/.test(item || '')) || '';
    const [url = ''] = str.split('.js');
    return `https${url}.js.map`;
};

/**
 * Convert a Stacktrace to a dev sourcemaps.
 * It will extract the name of the item and download the correct sourcemap for the file.
 * @param  {String} body         Stacktrace
 * @param  {String} extractor    Macth for the name, will be inside a regexp ex: (appLazy|app)
 * @param  {Function} getSourceMap A promise to resolve the sourcemap
 * @return {Promise:<String>}
 */
const format = async (body = '', extractor = '', getSourceMap = noop) => {
    const url = getURL(body);
    const [urlMap = '', name] = url.match(new RegExp(`${extractor}\\..+`)) || [];
    const map = await getSourceMap(url);
    const info = readder([urlMap], { [name]: map });
    return convert(body, info);
};

module.exports = { format };
