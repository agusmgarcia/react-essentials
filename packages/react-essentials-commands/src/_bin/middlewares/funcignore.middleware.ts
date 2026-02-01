import createFileMiddleware from "./createFileMiddleware";

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
    "jest.config.js",
    "local.settings.json",
    "package-lock.json",
    "prettier.config.js",
    "src",
    "tsconfig.json",
    "webpack.config.js",
  ];
}
