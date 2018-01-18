## How to install

```sh
$ npm install
```

## Test

```shell
$ npm test
```

## Build

```shell
$ npm run build
```

## Documentation (script)

Binary Node.js >= 6 `./lib/translate.js`
Binary Node.js < 6 `./lib/translate.es5.js`

Ex:

```shell
$ ./lib/translate.js tests/app.js.map < testapp.txt
```

```shell
$ ./lib/translate.js tests/app.js.map tests/appLazy.js.map < tests.txt
```


Output:

> app.2ee28f9d8be7bdc316ddb862acaff899402acec0.js:1:937016 -> webpack:///src/app/user/services/manageUser.js:88:26

