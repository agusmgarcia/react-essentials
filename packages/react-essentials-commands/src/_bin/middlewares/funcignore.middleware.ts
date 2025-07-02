import createMiddleware from "./createMiddleware";

export default createMiddleware<string[]>({
  path: ".funcignore",
  template: getTemplate,
  valid: ["azure-func"],
});

function getTemplate(): string[] {
  return [
    "**/.*",
    ".eslintrc.js",
    ".next",
    "__azurite_db*__.json",
    "__blobstorage__",
    "__queuestorage__",
    "jest.config.js",
    "local.settings.json",
    "package-lock.json",
    "prettier.config.js",
    "src",
    "tsconfig.json",
    "webpack.config.js",
  ];
}
