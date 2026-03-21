import { EOL } from "os";

import {
  createFileMiddleware,
  type CreateFileMiddlewareTypes,
} from "#src/binaries/utils";
import { files, folders, properties } from "#src/modules";

const MIDDLEWARE = createFileMiddleware<Record<string, any>>({
  mapOutput: (output) => properties.sort(output),
  path: ".env.local",
  template: getTemplate,
  valid: ["app", "node"],
});

export default async function createEnvLocalMiddleware(
  context: CreateFileMiddlewareTypes.Context,
): Promise<void> {
  await Promise.all([MIDDLEWARE(context), deleteEnvFiles(context)]);
}

async function deleteEnvFiles(
  context: CreateFileMiddlewareTypes.Context,
): Promise<void> {
  if (context.command !== "regenerate") return;
  if (!!context.filesToRegenerate.length) return;
  if (context.core === "app" || context.core === "node") return;
  await folders
    .readFolder(".")
    .then((fs) => fs.filter((f) => f === ".env" || f.startsWith(".env.")))
    .then((fs) => Promise.all(fs.map((f) => files.removeFile(f))));
}

async function getTemplate(
  context: CreateFileMiddlewareTypes.Context,
): Promise<Record<string, any>> {
  const envLocal = await files.readFile(".env.local").then((envLocal) =>
    envLocal.split(EOL).reduce(
      (result, line) => {
        const [key, value] = line.split("=", 2);
        if (!key) return result;

        result[key] = value || "";
        return result;
      },
      {} as Record<string, string>,
    ),
  );

  return context.core === "app"
    ? {
        ...envLocal,
        APP_BASE_PATH: "",
        APP_VERSION: context.version,
        NEXT_PUBLIC_APP_VERSION: undefined,
        NEXT_PUBLIC_BASE_PATH: undefined,
      }
    : {
        ...envLocal,
        APP_BASE_PATH: undefined,
        APP_VERSION: context.version,
        NEXT_PUBLIC_APP_VERSION: undefined,
        NEXT_PUBLIC_BASE_PATH: undefined,
      };
}
