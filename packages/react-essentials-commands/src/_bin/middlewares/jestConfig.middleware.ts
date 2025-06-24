import { files, folders } from "#src/utils";

import createMiddleware, { type Context } from "./createMiddleware";

const MIDDLEWARE = createMiddleware<string>({
  path: "jest.config.js",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

export default async function jestConfigMiddleware(
  context: Context,
): Promise<void> {
  await Promise.all([
    MIDDLEWARE(context),
    files.removeFile("jest.config.mjs"),
    files.removeFile("jest.config.ts"),
  ]);
  context.defer(() => folders.removeFolder(".swc"));
}

function getTemplate(context: Context): string {
  return `const { createJestConfig } = require("${context.essentialsCommands ? "./dist" : context.essentialsCommandsName}");

module.exports = createJestConfig("${context.core}");
`;
}
