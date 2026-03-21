import {
  createFileMiddleware,
  type CreateFileMiddlewareTypes,
} from "#src/binaries/utils";
import { files, folders } from "#src/modules";

const MIDDLEWARE = createFileMiddleware<string>({
  path: "jest.config.js",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

export default async function createJestConfigMiddleware(
  context: CreateFileMiddlewareTypes.Context,
): Promise<void> {
  await Promise.all([MIDDLEWARE(context), deleteJestConfigFiles(context)]);
  context.defer(() => folders.removeFolder(".swc"));
}

async function deleteJestConfigFiles(
  context: CreateFileMiddlewareTypes.Context,
): Promise<void> {
  if (context.command !== "regenerate") return;
  if (!!context.filesToRegenerate.length) return;
  await Promise.all([
    files.removeFile("jest.config.mjs"),
    files.removeFile("jest.config.ts"),
  ]);
}

function getTemplate(context: CreateFileMiddlewareTypes.Context): string {
  return `const { createJestConfig } = require("${context.essentialsCommands ? "./dist" : context.essentialsCommandsName}");

module.exports = createJestConfig("${context.core}");
`;
}
