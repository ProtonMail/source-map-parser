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
