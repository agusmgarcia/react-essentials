import { createFileMiddleware } from "#src/binaries/createFileMiddleware";

export default createFileMiddleware<string[]>({
  path: ".funcignore",
  template: getTemplate,
  valid: ["azure-func"],
});

function getTemplate(): string[] {
  return [
    "**/.*",
    ".next",
    "__azurite_db*__.json",
    "__blobstorage__",
    "__queuestorage__",
    "eslint.config.js",
    "local.settings.json",
    "package-lock.json",
    "prettier.config.js",
    "src",
    "vitest.config.js",
    "tsconfig.json",
    "webpack.config.ts",
  ];
}
