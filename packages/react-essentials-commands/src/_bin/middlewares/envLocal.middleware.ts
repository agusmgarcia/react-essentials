import { EOL } from "os";

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

async function getTemplate(context: Context): Promise<Record<string, any>> {
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
        APP_VERSION: context.version,
        BASE_PATH: "",
        NEXT_PUBLIC_APP_VERSION: undefined,
        NEXT_PUBLIC_BASE_PATH: undefined,
      }
    : {
        ...envLocal,
        APP_VERSION: context.version,
        BASE_PATH: undefined,
        NEXT_PUBLIC_APP_VERSION: undefined,
        NEXT_PUBLIC_BASE_PATH: undefined,
      };
}
