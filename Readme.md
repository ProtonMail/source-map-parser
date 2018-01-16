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
$ ./dist/translate.js tests/app.js.map < tests/index.txt
```

### Node.js < v6
```shell
$ ./dist/translate.es5.js tests/app.js.map < tests/index.txt
```

Output:

> assets/app.362ac5a3928a3006.js:52:10992 -> ../../build/src/app/directives/squire.js:155:26
> assets/app.362ac5a3928a3006.js:47:16232 -> ../../build/src/app/controllers/header.js:219:13

