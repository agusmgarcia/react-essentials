import { createAppCSSMiddleware } from "./createAppCSSMiddleware";
import { createAppMiddleware } from "./createAppMiddleware";
import { createChangelogMiddleware } from "./createChangelogMiddleware";
import { createEnvLocalMiddleware } from "./createEnvLocalMiddleware";
import { createEslintConfigMiddleware } from "./createEslintConfigMiddleware";
import { createFuncignoreMiddleware } from "./createFuncignoreMiddleware";
import { createGitignoreMiddleware } from "./createGitignoreMiddleware";
import { createHostMiddleware } from "./createHostMiddleware";
import { createHttpTrigger1Middleware } from "./createHttpTrigger1Middleware";
import { createIndexCSSMiddleware } from "./createIndexCSSMiddleware";
import { createIndexMiddleware } from "./createIndexMiddleware";
import { createLocalSettingsMiddleware } from "./createLocalSettingsMiddleware";
import { createNextConfigMiddleware } from "./createNextConfigMiddleware";
import { createNvmrcMiddleware } from "./createNvmrcMiddleware";
import { createPackageMiddleware } from "./createPackageMiddleware";
import { createPostCssConfigMiddleware } from "./createPostCssConfigMiddleware";
import { createPrettierConfigMiddleware } from "./createPrettierConfigMiddleware";
import { createReadmeMiddleware } from "./createReadmeMiddleware";
import { createReleaseMiddleware } from "./createReleaseMiddleware";
import { createTailwindConfigMiddleware } from "./createTailwindConfigMiddleware";
import { createTsConfigMiddleware } from "./createTsConfigMiddleware";
import { createTypesDMiddleware } from "./createTypesDMiddleware";
import { createVitestConfigMiddleware } from "./createVitestConfigMiddleware";
import { createWebpackConfigMiddleware } from "./createWebpackConfigMiddleware";

const middlewares = [
  createAppMiddleware,
  createAppCSSMiddleware,
  createChangelogMiddleware,
  createEnvLocalMiddleware,
  createEslintConfigMiddleware,
  createFuncignoreMiddleware,
  createGitignoreMiddleware,
  createHostMiddleware,
  createHttpTrigger1Middleware,
  createIndexMiddleware,
  createIndexCSSMiddleware,
  createLocalSettingsMiddleware,
  createNextConfigMiddleware,
  createNvmrcMiddleware,
  createPackageMiddleware,
  createPostCssConfigMiddleware,
  createPrettierConfigMiddleware,
  createReadmeMiddleware,
  createReleaseMiddleware,
  createTailwindConfigMiddleware,
  createTsConfigMiddleware,
  createTypesDMiddleware,
  createVitestConfigMiddleware,
  createWebpackConfigMiddleware,
];

export default middlewares;
