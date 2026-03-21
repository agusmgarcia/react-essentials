import {
  createFileMiddleware,
  type CreateFileMiddlewareTypes,
} from "#src/binaries/utils";
import { files } from "#src/modules";

const MIDDLEWARE = createFileMiddleware<string>({
  path: "postcss.config.js",
  template: getTemplate,
  valid: ["app", "lib"],
});

export default async function createPostCssConfigMiddleware(
  context: CreateFileMiddlewareTypes.Context,
): Promise<void> {
  await Promise.all([MIDDLEWARE(context), deletePostCSSConfigFiles(context)]);
}

async function deletePostCSSConfigFiles(
  context: CreateFileMiddlewareTypes.Context,
): Promise<void> {
  if (context.command !== "regenerate") return;
  if (!!context.filesToRegenerate.length) return;
  await Promise.all([
    files.removeFile("postcss.config.mjs"),
    files.removeFile("postcss.config.ts"),
  ]);
}

function getTemplate(context: CreateFileMiddlewareTypes.Context): string {
  return `const { createPostCSSConfig } = require("${context.essentialsCommands ? "./dist" : context.essentialsCommandsName}");

module.exports = createPostCSSConfig("${context.core}");
`;
}
