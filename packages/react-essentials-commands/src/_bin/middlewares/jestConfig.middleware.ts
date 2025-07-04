import { files, folders } from "#src/utils";

import createFileMiddleware from "./createFileMiddleware";
import { type Context } from "./Middleware.types";

const MIDDLEWARE = createFileMiddleware<string>({
  path: "jest.config.js",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

export default async function jestConfigMiddleware(
  context: Context,
): Promise<void> {
  await Promise.all([MIDDLEWARE(context), deleteJestConfigFiles(context)]);
  context.defer(() => folders.removeFolder(".swc"));
}

async function deleteJestConfigFiles(context: Context): Promise<void> {
  if (context.command !== "regenerate") return;
  await Promise.all([
    files.removeFile("jest.config.mjs"),
    files.removeFile("jest.config.ts"),
  ]);
}

function getTemplate(context: Context): string {
  return `const { createJestConfig } = require("${context.essentialsCommands ? "./dist" : context.essentialsCommandsName}");

module.exports = createJestConfig("${context.core}");
`;
}
