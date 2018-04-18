## How to install

```sh
$ npm install
```

## Test

```shell
$ npm test
```

## Documentation (script)

Ex:

```shell
$ ./index.js tests/app.js.map < testapp.txt
```

```shell
$ ./lib/index.js tests/app.js.map tests/appLazy.js.map < tests.txt
```

Output:

> app.2ee28f9d8be7bdc316ddb862acaff899402acec0.js:1:937016 -> webpack:///src/app/user/services/manageUser.js:88:26

### Convert a full stacktrace

```shell
$ ./lib/reader.js tests/stracktrace.js.map < stacktrace.txt
```


### Node.js API

```js
const sourceMap = require('parse-source-maps');

const output = await sourceMap.format(stacktrace, '(appLazy|app)', getSourceMap)
```

#### `format(stacktrace<String>, extractor:<String>, getSourceMap:<Promise:sourcemap>)`
  - stacktrace: error stacktrace
  - extractor: custom extractor to get the key we need to extract for the URL to identify the sourcemap

> https://mail.protonmail.com/appLazy.ddc866e839cc1068885481c130ab2bd21c5d6cba.js:1:725627 => (appLazy|app) to validate this url (ex: we can have an error from vendor, without sourcemaps).

  - getSourceMap: A promise to return the sourcemap, it takes as arg the url of the sourcemap

ex:

```js
const getSourceMap = async (url) => {
    const response = await got(url);
    return response.body;
};
```

Ex app using this module [Read source maps](https://github.com/dhoko/readMaps)
