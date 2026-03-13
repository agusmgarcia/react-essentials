import {
  createFileMiddleware,
  type CreateFileMiddlewareTypes,
} from "#src/binaries/utils";
import { files } from "#src/modules";

const MIDDLEWARE = createFileMiddleware<string>({
  path: "webpack.config.ts",
  template: getTemplate,
  valid: ["azure-func", "lib", "node"],
});

export default async function webpackConfigMiddleware(
  context: CreateFileMiddlewareTypes.Context,
): Promise<void> {
  await Promise.all([MIDDLEWARE(context), deleteWebpackConfigFiles(context)]);
}

async function deleteWebpackConfigFiles(
  context: CreateFileMiddlewareTypes.Context,
): Promise<void> {
  if (context.command !== "regenerate") return;
  if (!!context.filesToRegenerate.length) return;
  await Promise.all([
    files.removeFile("webpack.config.js"),
    files.removeFile("webpack.config.mjs"),
  ]);
}

function getTemplate(context: CreateFileMiddlewareTypes.Context): string {
  return `import { createWebpackConfig } from "${context.essentialsCommands ? "./src/configs" : context.essentialsCommandsName}";

export default createWebpackConfig("${context.core}");
`;
}
