import { files } from "#src/utils";

import createFileMiddleware from "./createFileMiddleware";
import { type Context } from "./Middleware.types";

const MIDDLEWARE = createFileMiddleware<string>({
  path: ".eslintrc.js",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

export default async function eslintConfigMiddleware(
  context: Context,
): Promise<void> {
  await Promise.all([MIDDLEWARE(context), deleteEslintConfigFiles(context)]);
}

async function deleteEslintConfigFiles(context: Context): Promise<void> {
  if (context.command !== "regenerate") return;
  if (!!context.filesToRegenerate.length) return;
  await Promise.all([
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
