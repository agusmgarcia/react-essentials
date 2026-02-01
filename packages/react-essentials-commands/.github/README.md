# React Essentials Commands

Set of opinionated commands to build, check, deploy, format, pack, run and test NextJS applications and libraries and Azure functions.

## Setup

In your _package.json_ file, make sure you have set `core: "app"` in case it is a NextJS application, `core: "lib"` for library, `core: "azure-func"` for Azure functions or `core: "node"` for NodeJS applications.

```jsonc
// ./package.json

{
  "core": "app",
}
```

Then, add the following command within the scripts section of the _package.json_.

```jsonc
// ./package.json

{
  "scripts": {
    // ...
    "regenerate": "react-essentials-commands-regenerate",
  },
}
```

And run:

```bash
npm run regenerate
```

## Commands

This will create all the necessary files to run the application.

### Deploy

```bash
npm run deploy
```

It is a script that automatically creates corresponding Git tags based on the type of the commits. It also forward the changes to the following tags as well. For example, if you make a fix on top of the tag `v1.0.2`, it is going to create `v1.0.3`. But, if there is also a tag like `v1.1.8`, it is going to cherry-pick the fix and merge it on top of that, creating the tag `v1.1.9`. This action is repeated until the last tag.

#### Interactive mode

When running `npm run deploy`, the process start merging commits into the differents tags. That's made to propagate changes across upper versions automatically. In case you want to go step by step use the `--interactive` flag.

```bash
npm run deploy -- --interactive
```

#### No tag

When running `npm run deploy`, the process performs some operations and commits the changes under new tags. If you want to skip the tag creation you can use the `--no-tag` flag. This will cause to skip the first tag creation and the abortion of the subsequent commands.

```bash
npm run deploy -- --no-tag
```

### Regenerate

```bash
npm run regenerate
```

Regenerate the files with the latest version. Based on the `core` property you set in the _package.json_ some files are generated and some not.

Here the list of the files:

- .github/CHANGELOG.md
- .github/README.md
- .github/workflows/release.yml
- pages/\_app.css
- pages/\_app.tsx
- src/index.css
- src/index.ts
- src/functions/httpTrigger1.ts
- .env.local
- .funcignore
- .gitignore
- .nvmrc
- eslint.config.js
- host.json
- jest.config.js
- local.settings.json
- next.config.js
- package.json
- postcss.config.js
- prettier.config.js
- tsconfig.json
- webpack.config.js

#### Specific files

By default the command regenerates all the files. But you can select which ones by using the `--file=` argument.

```bash
npm run regenerate -- --file=local.settings.json
```

> You can set the argument multiple times to target multiple files.

### Start

```bash
npm start
```

> It creates a server to run the applications.

#### Change port

By default the server is created at <http://localhost:3000>. In case you want to set another port explicitly, append the `--port=` parameter.

```bash
npm start -- --port=3001
```

### Test

```bash
npm test
```

Runs all the tests files located in the project.

#### Select test files

If you want to run some tests for specific files use the `--pattern` argument to the test script.

```bash
npm test -- --pattern=src/mytest.test.ts
```

#### Watch test files

If you want to watch files for changes and rerun tests related to changed files use the `--watch` argument to the test script.

```bash
npm run test -- --watch
```
