#!/usr/bin/env node

const chalk = require('chalk');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const stripAnsi = require('strip-ansi');

const MAP = {
    app: {
        map: ['app.js.map'],
        test: 'testapp.txt',
        output: 'app.2ee28f9d8be7bdc316ddb862acaff899402acec0.js:1:937016 -> webpack:///src/app/user/services/manageUser.js:88:26'
    },
    appLazy: {
        map: ['appLazy.js.map'],
        test: 'testappLazy.txt',
        output: 'appLazy.d612b12169d1f9664910bfd8ee0226ba5862165e.js:1:600624 -> webpack:///src/app/message/factories/messageModel.js:195:20'
    },
    multilines: {
        map: [ 'app.js.map', 'appLazy.js.map' ],
        test: 'tests.txt',
        output: 'app.2ee28f9d8be7bdc316ddb862acaff899402acec0.js:1:937016 -> webpack:///src/app/user/services/manageUser.js:88:26appLazy.6f6aafd600d17208358fe2d4859c3dc3e23bab66.js:1:693466 -> webpack:///src/app/blackFriday/factories/blackFridayModel.js:129:70'
    },
};

const success = (msg) => console.log(`  ${chalk.green('✓')} ${msg}`);
const error = (e) => console.log(`  ${chalk.red('×')} ${chalk.red(e.message ? e.message : e)}`);

const formatCommand = ({ map, test }, version = 6) => {
    const sourceMaps = map.map((name) => `tests/${name}`).join(' ');
    const arg = `${sourceMaps} < tests/${test}`;
    if (version === 6) {
        return `./lib/translate.js ${arg}`;
    }
    return `./lib/translate.es5.js ${arg}`;
};

/**
 * Test if the output is correct
 * @param  {String} key     type of parsing
 * @param  {Number} version compat node version
 * @return {Promise}
 */
const test =  async (key, version = 6) => {
    const { output } = MAP[key];
    const { stdout } = await exec(formatCommand(MAP[key], version));
    if (stripAnsi(stdout) !== output) {
        return error(`Wrong source map parsing for type:${key} and version:${version}`);
    }
    success(`Valid ${key} format - version:${version}`);
};

(async () => {
    try {

        for (version of [5, 6]) {
            await test('appLazy', version);
            await test('app', version);
            await test('multilines', version);
            console.log('');
        }

        process.exit(0);
    } catch (e) {
        console.log(chalk.red('×'), chalk.red(e.message));
        process.exit(1);
    }
})();
