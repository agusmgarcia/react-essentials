# Changelog

All notable changes to this project will be documented in this file.

## [v0.8.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v0.8.0)

> August 4, 2025

### Features ✅

- **release.yml**: add run-name
- **createNextConfig**: remove configs

### Fixes 🎯

- bump dependencies

## [v0.7.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v0.7.0)

> July 26, 2025

### Features ✅

- **createWebpackConfig**: prevent setting NODE_ENV for libs
- remove unused utilities
- **createWebpackConfig**: stop using MiniCSSExtractPlugin

### Fixes 🎯

- **createJestConfig**: adjust testMatch
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

- add documentation to the createConfigs functions
- **release.yml**: adjust sorting options
- prevent deleting file when regenerating phase doesn't include it
- prevent regenerating files outside regenerate phase
- **createPrettierConfig**: adjust output types
- **createWebpackConfig**: adjust order of outputs
- **createWebpackConfig**: adjust css locator

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

- **release.yml**: set TODO's for the future
- **release.yml**: stop using working-directory where not supported
- **release.yml**: adjust typo

## [v0.1.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v0.1.0)

> July 26, 2025

### Features ✅

- **react-essentials-commands**: add project
