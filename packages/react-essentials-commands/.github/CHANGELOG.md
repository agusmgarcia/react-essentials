# Changelog

All notable changes to this project will be documented in this file.

## [v0.11.1](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v0.11.1)

> August 29, 2025

### Fixes 🎯

- **release**: execute scripts if present

### Chores ⚙️

- bump dependencies

## [v0.11.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v0.11.0)

> August 27, 2025

### Features ✅

- **createNextConfig**: start forwarding all the environments variables that starts with APP\_
- **release-azure-func.yml**: add ability to upload all the env variables that starts with APP\_

## [v0.10.1](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v0.10.1)

> August 20, 2025

### Fixes 🎯

- **release.yml**: include README and CHANGELOG files

### Chores ⚙️

- bump dependencies

## [v0.10.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v0.10.0)

> August 20, 2025

### Features ✅

- **release.yml**: separate jobs in ci and cd
- **createWebpackConfig**: export a library name per output
- **createNextConfig**: remove NEXT*PUBLIC* prefix

### Chores ⚙️

- use tsconfig paths for ts-node
- **LoadEnvConfigLoader**: add doc
- **createPrettierConfig**: adjust doc
- **createPostCSSConfig**: adjust types
- start using emptyFunction

## [v0.9.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v0.9.0)

> August 9, 2025

### Features ✅

- **local.settings.json**: keep old values
- **env.local**: keep old values
- **changelog.md**: discriminate chore commits
- **release.yml**: reuse workflows
- **deploy**: add support for external paths
- **tsconfig.json**: use base configs from commands
- **createWebpackConfig**: start exporting json files from \_out folder

## [v0.8.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v0.8.0)

> August 4, 2025

### Features ✅

- **release.yml**: add run-name
- **createNextConfig**: remove configs

### Chores ⚙️

- bump dependencies

## [v0.7.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v0.7.0)

> July 26, 2025

### Features ✅

- **createWebpackConfig**: prevent setting NODE_ENV for libs
- remove unused utilities
- **createWebpackConfig**: stop using MiniCSSExtractPlugin

### Fixes 🎯

- **createJestConfig**: adjust testMatch

### Chores ⚙️

- bump dependencies
- **createEslintConfig**: remove space

## [v0.6.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v0.6.0)

> July 26, 2025

### Features ✅

- **errors.getMessage**: send undefined when no error
- **createWebpackConfig**: make externals config as function for libs
- **createWebpackConfig**: add alias option
- **createWebpackConfig**: add react/jsx-runtime as external
- **args**: stop validating args
- adjust install process
- **createJestConfig**: add support for \_bin folder for libs

### Fixes 🎯

- **release.yml**: adjust sorting options
- prevent deleting file when regenerating phase doesn't include it
- prevent regenerating files outside regenerate phase
- **createWebpackConfig**: adjust order of outputs
- **createWebpackConfig**: adjust css locator

### Chores ⚙️

- add documentation to the createConfigs functions
- **createPrettierConfig**: adjust output types

## [v0.5.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v0.5.0)

> July 26, 2025

### Features ✅

- **errors**: encapsulate it into a module
- **properties**: encapsulate into a module
- **sortProperties**: add types
- add ability to customize the error message when not found

### Fixes 🎯

- **createWebpackConfig**: limit the core option to lib, azure-func or node
- **createPostCSSConfig**: limit the core option to app or lib
- **createNextConfig**: limit the core option to app
- **check**: adjust typescript checks
- adjust getPackageJSON result type

## [v0.4.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v0.4.0)

> July 26, 2025

### Features ✅

- return non-zero exit code on error
- stop installing azure-functions-core-tools as peers
- **.eslintrc.js**: include scope dependencies
- make compatible with react 18

### Fixes 🎯

- **.gitignore**: stop sorting properties
- **.funcignore**: stop sorting properties
- adjust the logic to calculate the latest version of a package
- **.funcignore**: adjust WEBSITE_NODE_DEFAULT_VERSION

## [v0.3.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v0.3.0)

> July 26, 2025

### Features ✅

- stop using --ignore-scripts
- abort operation on error
- **hasProperty**: add utils
- **files**: send emtpy string instead of undefined

### Fixes 🎯

- exit with error when format not pass

## [v0.2.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v0.2.0)

> July 26, 2025

### Features ✅

- **package.json**: merge peers with devs for lib
- **.eslintrc.js**: exclude .next folder
- **.funcignore**: exclude .next folder
- **tsconfig.json**: exclude .next folder
- **.gitignore**: exclude .next folder
- **next.config.js**: add ability to customize props

### Fixes 🎯

- **release.yml**: stop using working-directory where not supported
- **release.yml**: adjust typo

### Chores ⚙️

- **release.yml**: set TODO's for the future

## [v0.1.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v0.1.0)

> July 26, 2025

### Features ✅

- **react-essentials-commands**: add project

### Chores ⚙️

- setup project
