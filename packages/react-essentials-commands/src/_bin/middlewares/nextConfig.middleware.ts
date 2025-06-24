import { files, folders } from "#src/utils";

import createMiddleware, { type Context } from "./createMiddleware";

const MIDDLEWARE = createMiddleware<string>({
  path: "next.config.js",
  template: getTemplate,
  valid: ["app"],
});

export default async function nextConfigMiddleware(
  context: Context,
): Promise<void> {
  await Promise.all([
    MIDDLEWARE(context),
    files.removeFile("next.config.mjs"),
    files.removeFile("next.config.ts"),
    files.removeFile("out"),
  ]);

  if (context.core !== "app")
    context.defer(() => files.removeFile("next-env.d.ts"));
  else context.defer(() => folders.removeFolder(".next"));
}

function getTemplate(context: Context): string {
  return `const { createNextConfig } = require("${context.essentialsCommands ? "./dist" : context.essentialsCommandsName}");

module.exports = createNextConfig("${context.core}");
`;
}
