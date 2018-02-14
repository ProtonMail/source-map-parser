#!/usr/bin/env node

const fs = require('fs');
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
    stacktrace: {
        map: ['stacktrace.js.map'],
        test: 'stacktrace.txt',
        command: 'reader',
        output: fs.readFileSync('tests/stacktrace.output.txt').toString()

    }
};

const success = (msg) => console.log(`  ${chalk.green('✓')} ${msg}`);
const error = (e) => console.log(`  ${chalk.red('×')} ${chalk.red(e.message ? e.message : e)}`);

const formatCommand = ({ map, test, command ='index' }) => {
    const sourceMaps = map.map((name) => `tests/${name}`).join(' ');
    const arg = `${sourceMaps} < tests/${test}`;
    return `./${command}.js ${arg}`
};

/**
 * Test if the output is correct
 * @param  {String} key     type of parsing
 * @param  {Number} version compat node version
 * @return {Promise}
 */
const test =  async (key) => {
    const { output } = MAP[key];
    const { stdout } = await exec(formatCommand(MAP[key]));

    if (stripAnsi(stdout) !== output) {
        return error(`Wrong source map parsing for type:${key}`);
    }
    success(`Valid ${key} format`);
};

(async () => {
    try {

        await test('appLazy');
        await test('app');
        await test('multilines');
        await test('stacktrace');
        console.log('');

        process.exit(0);
    } catch (e) {
        console.log(chalk.red('×'), chalk.red(e.message));
        process.exit(1);
    }
})();
