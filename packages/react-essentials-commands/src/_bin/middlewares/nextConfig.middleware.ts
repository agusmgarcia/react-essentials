import { files, folders } from "#src/utils";

import createFileMiddleware from "./createFileMiddleware";
import { type Context } from "./Middleware.types";

const MIDDLEWARE = createFileMiddleware<string>({
  path: "next.config.js",
  template: getTemplate,
  valid: ["app"],
});

export default async function nextConfigMiddleware(
  context: Context,
): Promise<void> {
  await Promise.all([MIDDLEWARE(context), deleteNextConfigFiles(context)]);
  if (context.core === "app")
    context.defer(() => folders.removeFolder(".next"));
  else context.defer(() => files.removeFile("next-env.d.ts"));
}

async function deleteNextConfigFiles(context: Context): Promise<void> {
  if (context.command !== "regenerate") return;
  await Promise.all([
    files.removeFile("next.config.mjs"),
    files.removeFile("next.config.ts"),
    files.removeFile("out"),
  ]);
}

function getTemplate(context: Context): string {
  return `const { createNextConfig } = require("${context.essentialsCommands ? "./dist" : context.essentialsCommandsName}");

module.exports = createNextConfig("${context.core}");
`;
}
