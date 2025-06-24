import { files } from "#src/utils";

import createMiddleware, { type Context } from "./createMiddleware";

const MIDDLEWARE = createMiddleware<string>({
  path: getPath,
  template: getTemplate,
  valid: ["azure-func", "lib", "node"],
});

export default async function webpackConfigMiddleware(
  context: Context,
): Promise<void> {
  await Promise.all([
    MIDDLEWARE(context),
    context.essentialsCommands
      ? files.removeFile("webpack.config.js")
      : files.removeFile("webpack.config.ts"),
    files.removeFile("webpack.config.mjs"),
  ]);
}

function getPath(context: Context): string {
  return context.essentialsCommands ? "webpack.config.ts" : "webpack.config.js";
}

function getTemplate(context: Context): string {
  if (context.essentialsCommands)
    return `import { createWebpackConfig } from "./src/configs";

export default createWebpackConfig("${context.core}");
`;

  return `const { createWebpackConfig } = require("${context.essentialsCommandsName}");

module.exports = createWebpackConfig("${context.core}");
`;
}
