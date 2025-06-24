import { files } from "#src/utils";

import createMiddleware, { type Context } from "./createMiddleware";

const MIDDLEWARE = createMiddleware<string>({
  path: ".eslintrc.js",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

export default async function eslintConfigMiddleware(
  context: Context,
): Promise<void> {
  await Promise.all([
    MIDDLEWARE(context),
    files.removeFile(".eslintrc"),
    files.removeFile(".eslintignore"),
    files.removeFile("eslint.config.js"),
    files.removeFile("eslint.config.mjs"),
    files.removeFile("eslint.config.ts"),
  ]);
}

function getTemplate(context: Context): string {
  return `const { createEslintConfig } = require("${context.essentialsCommands ? "./dist" : context.essentialsCommandsName}");

module.exports = createEslintConfig("${context.core}");
`;
}
