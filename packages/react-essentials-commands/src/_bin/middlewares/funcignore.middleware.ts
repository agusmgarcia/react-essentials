import { sortProperties } from "#src/utils";

import createMiddleware from "./createMiddleware";

export default createMiddleware<string[]>({
  mapOutput: (output) => sortProperties(output),
  path: ".funcignore",
  template: getTemplate,
  valid: ["azure-func"],
});

function getTemplate(): string[] {
  return [
    "__azurite_db*__.json",
    "__blobstorage__",
    "__queuestorage__",
    "**/.*",
    "src",
    ".eslintrc.js",
    "jest.config.js",
    "local.settings.json",
    "package-lock.json",
    "prettier.config.js",
    "tsconfig.json",
    "webpack.config.js",
  ];
}
