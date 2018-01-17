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

Ex:
### Node.js >= v6
```shell
$ ./lib/translate.js tests/app.js.map < testapp.txt
```

### Node.js < v6
```shell
$ ./lib/translate.es5.js tests/app.js.map < testapp.txt
```

Output:

> app.2ee28f9d8be7bdc316ddb862acaff899402acec0.js:1:937016 -> webpack:///src/app/user/services/manageUser.js:88:26

