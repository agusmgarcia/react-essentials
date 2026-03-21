import {
  createFileMiddleware,
  type CreateFileMiddlewareTypes,
} from "#src/binaries/utils";
import { files } from "#src/modules";

const MIDDLEWARE = createFileMiddleware<string>({
  path: "eslint.config.js",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

export default async function createEslintConfigMiddleware(
  context: CreateFileMiddlewareTypes.Context,
): Promise<void> {
  await Promise.all([MIDDLEWARE(context), deleteEslintConfigFiles(context)]);
}

async function deleteEslintConfigFiles(
  context: CreateFileMiddlewareTypes.Context,
): Promise<void> {
  if (context.command !== "regenerate") return;
  if (!!context.filesToRegenerate.length) return;
  await Promise.all([
    files.removeFile(".eslintrc.js"),
    files.removeFile(".eslintrc"),
    files.removeFile(".eslintignore"),
    files.removeFile("eslint.config.mjs"),
    files.removeFile("eslint.config.ts"),
  ]);
}

function getTemplate(context: CreateFileMiddlewareTypes.Context): string {
  return `const { createEslintConfig } = require("${context.essentialsCommands ? "./dist" : context.essentialsCommandsName}");

module.exports = createEslintConfig("${context.core}");
`;
}
