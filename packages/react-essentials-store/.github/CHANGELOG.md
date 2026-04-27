# Changelog

All notable changes to this project will be documented in this file.

## [v0.23.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.23.0)

> April 27, 2026

### Features ✅

- **types.d.ts**: add middleware
- start creating dummy index files
- **tsconfig**: enable stricter configs
- start using eslint file-composition rules
- start using eslint independent-modules rules
- start using eslint project-structure rules
- **createWebpackConfig**: always import for node and web
- start using webpack.config.ts

### Fixes 🎯

- **createReactStore**: minor type fix

### Chores ⚙️

- adjust eslint errors
- separate eslint configurations into its module
- bump dependencies

## [v0.22.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.22.0)

> February 3, 2026

### Features ✅

- start using next 16

## [v0.21.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.21.0)

> January 20, 2026

### Features ✅

- **ServerSlice**: expose request
- **ServerSlice**: stop sending equality func to reloadWithRequest method

## [v0.20.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.20.0)

> January 19, 2026

### Features ✅

- start using the new NPM publish policy
- **ServerSlice**: add reloadWithRequest the ability to pass a custom equality func
- stop using peers dependencies
- **ServerSlice**: stop exposing request
- **GlobalSlice**: stop checking signals
- start validating overrides

## [v0.19.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.19.0)

> November 17, 2025

### Features ✅

- **GlobalSlice**: remove BaseState restriction
- **ServerSlice**: add reloadWithRequest method
- **GlobalSlice**: keep reference of last subscription selection
- **GlobalSlice**: remove prevSelection from listener
- **GlobalSlice**: stop using SELECTOR_SKIPPED_ERROR
- **ServerSlice**: rename onBuildRequest by onRequestBuild
- validate whether signal is the current one
- **Store**: protect slice methods
- **GlobalSlice**: regenerate signal when invoking a method from other slice
- **GlobalSlice**: add signal to onDestroy method
- **GlobalSlice**: add setTimeout method
- **GlobalSlice**: add setInterval method
- **GlobalSlice**: remove Unsubscribe type

### Fixes 🎯

- **StorageSlice**: set error on deserialize

### Chores ⚙️

- improve error messaging
- super(ServerSlice): expose error and loading properties
- **BrowserStorageSlice**: encapsulate logic into a single class
- add missing return types

## [v0.18.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.18.0)

> November 7, 2025

### Features ✅

- **ServerSlice**: remove reload with request args method

### Chores ⚙️

- adjust peers

## [v0.17.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.17.0)

> November 3, 2025

### Features ✅

- **createReactStore**: configure devTools when invoking the function
- **Store**: add equality function to filter devtools states

### Chores ⚙️

- adjust peers
- **GlobalSlice**: document the SELECTOR_SKIPPED_ERROR

## [v0.16.2](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.16.2)

> October 29, 2025

### Chores ⚙️

- disable tw plugin
- bump dependencies

## [v0.16.1](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.16.1)

> October 18, 2025

### Chores ⚙️

- adjust folder structure

## [v0.16.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.16.0)

> October 2, 2025

### Features ✅

- **Store**: pass signal into the middlewares

## [v0.15.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.15.0)

> September 27, 2025

### Features ✅

- add signal to the onInit method
- add signal into the subscribe method

## [v0.14.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.14.0)

> September 23, 2025

### Features ✅

- add signal to all the public methods
- **StorageSlice**: stop receiving initial data
- **ServerSlice**: make initial response explicit
- **ServerSlice**: keep last response on error

## [v0.13.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.13.0)

> September 3, 2025

### Features ✅

- add protected constructor

## [v0.12.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.12.0)

> August 28, 2025

### Features ✅

- **ServerSlice**: store raw error
- remove protected constructor
- **ServerSlice**: prevent setting which errors can be bypassed

## [v0.11.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.11.0)

> August 27, 2025

### Features ✅

- **ServerSlice**: add configs

### Chores ⚙️

- adjust peer dependencies

## [v0.10.1](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.10.1)

> August 20, 2025

### Chores ⚙️

- bump dependencies

## [v0.10.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.10.0)

> August 20, 2025

### Features ✅

- **release.yml**: separate jobs in ci and cd

## [v0.9.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.9.0)

> August 9, 2025

### Features ✅

- **tsconfig.json**: use base configs from commands
- **OmitProperty**: remove type

## [v0.8.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.8.0)

> August 4, 2025

### Features ✅

- **store**: use classes instead of functions

### Chores ⚙️

- bump dependencies

## [v0.7.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.7.0)

> July 26, 2025

### Features ✅

- remove unused utilities

## [v0.6.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.6.0)

> July 26, 2025

### Features ✅

- **errors.getMessage**: send undefined when no error
- add zustand/middleware as external
- stop using SubscribeContext
- adjust install process

## [v0.5.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.5.0)

> July 26, 2025

### Features ✅

- **errors**: encapsulate it into a module

## [v0.4.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.4.0)

> July 26, 2025

### Features ✅

- **.eslintrc.js**: include scope dependencies
- make compatible with react 18

## [v0.3.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.3.0)

> July 26, 2025

### Features ✅

- stop using --ignore-scripts

### Fixes 🎯

- exit with error when format not pass

### Chores ⚙️

- **README.md**: update file

## [v0.2.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.2.0)

> July 26, 2025

### Features ✅

- **tsconfig.json**: exclude .next folder
- **.gitignore**: exclude .next folder

## [v0.1.0](https://github.com/agusmgarcia/react-essentials/tree/@agusmgarcia/react-essentials-store@v0.1.0)

> July 26, 2025

### Features ✅

- **react-essentials-store**: add project
