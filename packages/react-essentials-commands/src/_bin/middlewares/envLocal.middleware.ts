import { files, folders, properties } from "#src/utils";

import createFileMiddleware from "./createFileMiddleware";
import { type Context } from "./Middleware.types";

const MIDDLEWARE = createFileMiddleware<Record<string, any>>({
  mapOutput: (output) => properties.sort(output),
  path: ".env.local",
  template: getTemplate,
  valid: ["app", "node"],
});

export default async function envLocalMiddleware(
  context: Context,
): Promise<void> {
  await Promise.all([MIDDLEWARE(context), deleteEnvFiles(context)]);
}

async function deleteEnvFiles(context: Context): Promise<void> {
  if (context.command !== "regenerate") return;
  if (!!context.filesToRegenerate.length) return;
  if (context.core === "app" || context.core === "node") return;
  await folders
    .readFolder(".")
    .then((fs) => fs.filter((f) => f === ".env" || f.startsWith(".env.")))
    .then((fs) => Promise.all(fs.map((f) => files.removeFile(f))));
}

function getTemplate(context: Context): Record<string, any> {
  return context.core === "app"
    ? {
        NEXT_PUBLIC_APP_VERSION: context.version,
        NEXT_PUBLIC_BASE_PATH: "",
      }
    : {
        APP_VERSION: context.version,
      };
}
