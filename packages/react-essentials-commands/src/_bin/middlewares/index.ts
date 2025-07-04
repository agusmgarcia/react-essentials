import appMiddleware from "./app.middleware";
import appCSSMiddleware from "./appCSS.middleware";
import changelogMiddleware from "./changelog.middleware";
import envLocalMiddleware from "./envLocal.middleware";
import eslintConfigMiddleware from "./eslintConfig.middleware";
import funcignoreMiddleware from "./funcignore.middleware";
import gitignoreMiddleware from "./gitignore.middleware";
import hostMiddleware from "./host.middleware";
import httpTrigger1Middleware from "./httpTrigger1.middleware";
import indexMiddleware from "./index.middleware";
import indexCSSMiddleware from "./indexCSS.middleware";
import jestConfigMiddleware from "./jestConfig.middleware";
import localSettingsMiddleware from "./localSettings.middleware";
import nextConfigMiddleware from "./nextConfig.middleware";
import nvmrcMiddleware from "./nvmrc.middleware";
import packageMiddleware from "./package.middleware";
import postCssConfigMiddleware from "./postCssConfig.middleware";
import prettierConfigMiddleware from "./prettierConfig.middleware";
import readmeMiddleware from "./readme.middleware";
import releaseMiddleware from "./release.middleware";
import tailwindConfigMiddleware from "./tailwindConfig.middleware";
import tsConfigMiddleware from "./tsConfig.middleware";
import webpackConfigMiddleware from "./webpackConfig.middleware";

const MIDDLEWARES = [
  appMiddleware,
  appCSSMiddleware,
  changelogMiddleware,
  envLocalMiddleware,
  eslintConfigMiddleware,
  funcignoreMiddleware,
  gitignoreMiddleware,
  hostMiddleware,
  httpTrigger1Middleware,
  indexMiddleware,
  indexCSSMiddleware,
  jestConfigMiddleware,
  localSettingsMiddleware,
  nextConfigMiddleware,
  nvmrcMiddleware,
  packageMiddleware,
  postCssConfigMiddleware,
  prettierConfigMiddleware,
  readmeMiddleware,
  releaseMiddleware,
  tailwindConfigMiddleware,
  tsConfigMiddleware,
  webpackConfigMiddleware,
];

export type * as MiddlewaresTypes from "./Middleware.types";
export default MIDDLEWARES;
