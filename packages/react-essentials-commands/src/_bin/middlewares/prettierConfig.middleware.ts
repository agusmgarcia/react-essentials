import { files } from "#src/utils";

import createFileMiddleware from "./createFileMiddleware";
import { type Context } from "./Middleware.types";

const MIDDLEWARE = createFileMiddleware<string>({
  path: "prettier.config.js",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

export default async function prettierConfigMiddleware(
  context: Context,
): Promise<void> {
  await Promise.all([MIDDLEWARE(context), deletePrettierConfigFiles(context)]);
}

async function deletePrettierConfigFiles(context: Context): Promise<void> {
  if (context.command !== "regenerate") return;
  if (!!context.filesToRegenerate.length) return;
  await Promise.all([
    files.removeFile(".prettierrc"),
    files.removeFile(".prettierignore"),
    files.removeFile("prettier.config.mjs"),
    files.removeFile("prettier.config.ts"),
  ]);
}

function getTemplate(context: Context): string {
  return `const { createPrettierConfig } = require("${context.essentialsCommands ? "./dist" : context.essentialsCommandsName}");

module.exports = createPrettierConfig("${context.core}");
`;
}
