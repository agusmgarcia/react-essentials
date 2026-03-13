import {
  createFileMiddleware,
  type CreateFileMiddlewareTypes,
} from "#src/binaries/utils";
import { files } from "#src/modules";

const MIDDLEWARE = createFileMiddleware<string>({
  path: "prettier.config.js",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

export default async function prettierConfigMiddleware(
  context: CreateFileMiddlewareTypes.Context,
): Promise<void> {
  await Promise.all([MIDDLEWARE(context), deletePrettierConfigFiles(context)]);
}

async function deletePrettierConfigFiles(
  context: CreateFileMiddlewareTypes.Context,
): Promise<void> {
  if (context.command !== "regenerate") return;
  if (!!context.filesToRegenerate.length) return;
  await Promise.all([
    files.removeFile(".prettierrc"),
    files.removeFile(".prettierignore"),
    files.removeFile("prettier.config.mjs"),
    files.removeFile("prettier.config.ts"),
  ]);
}

function getTemplate(context: CreateFileMiddlewareTypes.Context): string {
  return `const { createPrettierConfig } = require("${context.essentialsCommands ? "./dist" : context.essentialsCommandsName}");

module.exports = createPrettierConfig("${context.core}");
`;
}
