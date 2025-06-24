import { files } from "#src/utils";

import createMiddleware, { type Context } from "./createMiddleware";

const MIDDLEWARE = createMiddleware<string>({
  path: "postcss.config.js",
  template: getTemplate,
  valid: ["app", "lib"],
});

export default async function postCssConfigMiddleware(
  context: Context,
): Promise<void> {
  await Promise.all([
    MIDDLEWARE(context),
    files.removeFile("postcss.config.mjs"),
    files.removeFile("postcss.config.ts"),
  ]);
}

function getTemplate(context: Context): string {
  return `const { createPostCSSConfig } = require("${context.essentialsCommands ? "./dist" : context.essentialsCommandsName}");

module.exports = createPostCSSConfig("${context.core}");
`;
}
