import { files } from "#src/utils";

import createFileMiddleware from "./createFileMiddleware";
import { type Context } from "./Middleware.types";

const MIDDLEWARE = createFileMiddleware<string>({
  path: getPath,
  template: getTemplate,
  valid: ["azure-func", "lib", "node"],
});

export default async function webpackConfigMiddleware(
  context: Context,
): Promise<void> {
  await Promise.all([MIDDLEWARE(context), deleteWebpackConfigFiles(context)]);
}

async function deleteWebpackConfigFiles(context: Context): Promise<void> {
  if (context.command !== "regenerate") return;
  if (!!context.filesToRegenerate.length) return;
  await Promise.all([
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
