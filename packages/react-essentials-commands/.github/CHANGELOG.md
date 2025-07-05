# Changelog

All notable changes to this project will be documented in this file.

## [v1.0.10](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v1.0.10)

> July 5, 2025

### Fixes 🎯

- **release.yml**: adjust sorting options
- prevent deleting file when regenerating phase doesn't include it

## [v1.0.9](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v1.0.9)

> July 4, 2025

### Fixes 🎯

- prevent regenerating files when --file arg is passed
- **args**: stop validating args
- prevent regenerating files outside regenerate phase

## [v1.0.8](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v1.0.8)

> July 4, 2025

### Fixes 🎯

- adjust install process

## [v1.0.7](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v1.0.7)

> July 4, 2025

### Fixes 🎯

- adjust install process
- **createJestConfig**: add support for \_bin folder for libs
- **createPrettierConfig**: adjust output types
- **createWebpackConfig**: adjust order of outputs
- **createWebpackConfig**: adjust css locator

## [v1.0.6](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v1.0.6)

> July 3, 2025

### Fixes 🎯

- **createWebpackConfig**: limit the core option to lib, azure-func or node
- **createPostCSSConfig**: limit the core option to app or lib
- **createNextConfig**: limit the core option to app
- **errors**: encapsulate it into a module
- **properties**: encapsulate into a module
- **check**: adjust typescript checks
- adjust getPackageJSON result type
- **sortProperties**: add types
- add ability to customize the error message when not found

## [v1.0.5](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v1.0.5)

> July 2, 2025

### Fixes 🎯

- return non-zero exit code on error
- **.gitignore**: stop sorting properties
- **.funcignore**: stop sorting properties
- adjust the logic to calculate the latest version of a package
- **.funcignore**: adjust WEBSITE_NODE_DEFAULT_VERSION

## [v1.0.4](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v1.0.4)

> June 30, 2025

### Fixes 🎯

- stop installing azure-functions-core-tools as peers

## [v1.0.3](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v1.0.3)

> June 30, 2025

### Fixes 🎯

- **.eslintrc.js**: include scope dependencies
- make compatible with react 18

## [v1.0.2](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v1.0.2)

> June 30, 2025

### Fixes 🎯

- stop using --ignore-scripts
- abort operation on error
- exit with error when format not pass
- **hasProperty**: include type
- **files**: send emtpy string instead of undefined

## [v1.0.1](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v1.0.1)

> June 29, 2025

### Fixes 🎯

- **package.json**: merge peers with devs for lib
- **.eslintrc.js**: exclude .next folder
- **.funcignore**: exclude .next folder
- **tsconfig.json**: exclude .next folder
- **.gitignore**: exclude .next folder
- **next.config.js**: add ability to customize props
- **release.yml**: set TODO's for the future
- **release.yml**: stop using working-directory where not supported
- **release.yml**: adjust typo

## [v1.0.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-commands@v1.0.0)

> June 29, 2025

### Breaking changes ❗️

- **react-essentials-commands**: add project
