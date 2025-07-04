import { files } from "#src/utils";

import createFileMiddleware from "./createFileMiddleware";
import { type Context } from "./Middleware.types";

const MIDDLEWARE = createFileMiddleware<string>({
  path: "postcss.config.js",
  template: getTemplate,
  valid: ["app", "lib"],
});

export default async function postCssConfigMiddleware(
  context: Context,
): Promise<void> {
  await Promise.all([MIDDLEWARE(context), deletePostCSSConfigFiles(context)]);
}

async function deletePostCSSConfigFiles(context: Context): Promise<void> {
  if (context.command !== "regenerate") return;
  await Promise.all([
    files.removeFile("postcss.config.mjs"),
    files.removeFile("postcss.config.ts"),
  ]);
}

function getTemplate(context: Context): string {
  return `const { createPostCSSConfig } = require("${context.essentialsCommands ? "./dist" : context.essentialsCommandsName}");

module.exports = createPostCSSConfig("${context.core}");
`;
}
