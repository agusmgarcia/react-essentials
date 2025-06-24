import { files } from "#src/utils";

import createMiddleware, { type Context } from "./createMiddleware";

const MIDDLEWARE = createMiddleware<string>({
  path: "prettier.config.js",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

export default async function prettierConfigMiddleware(
  context: Context,
): Promise<void> {
  await Promise.all([
    MIDDLEWARE(context),
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
