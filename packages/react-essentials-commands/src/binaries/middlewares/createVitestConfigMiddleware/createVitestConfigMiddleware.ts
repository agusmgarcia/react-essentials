import {
  createFileMiddleware,
  type CreateFileMiddlewareTypes,
} from "#src/binaries/createFileMiddleware";
import { files } from "#src/outputs/files";
import { folders } from "#src/outputs/folders";

const MIDDLEWARE = createFileMiddleware<string>({
  path: "vitest.config.js",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

export default async function createVitestConfigMiddleware(
  context: CreateFileMiddlewareTypes.Context,
): Promise<void> {
  await Promise.all([MIDDLEWARE(context), deleteOtherConfigFiles(context)]);
}

async function deleteOtherConfigFiles(
  context: CreateFileMiddlewareTypes.Context,
): Promise<void> {
  if (context.command !== "regenerate") return;
  if (!!context.filesToRegenerate.length) return;
  await Promise.all([
    folders.removeFolder(".swc"),
    files.removeFile("jest.config.js"),
    files.removeFile("jest.config.mjs"),
    files.removeFile("jest.config.ts"),
    files.removeFile("vitest.config.mjs"),
    files.removeFile("vitest.config.ts"),
  ]);
}

function getTemplate(context: CreateFileMiddlewareTypes.Context): string {
  return `const { createVitestConfig } = require("${context.essentialsCommands ? "./dist/index.node" : context.essentialsCommandsName}");

module.exports = createVitestConfig({ core: "${context.core}" });
`;
}
