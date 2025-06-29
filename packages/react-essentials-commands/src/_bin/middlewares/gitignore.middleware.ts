import { sortProperties } from "#src/utils";

import createMiddleware, { type Context } from "./createMiddleware";

export default createMiddleware<string[]>({
  mapOutput: (output) => sortProperties(output),
  path: ".gitignore",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

function getTemplate(context: Context): string[] {
  return context.core === "app"
    ? [".env*.local", ".next", "dist", "node_modules"]
    : context.core === "azure-func"
      ? [".next", "dist", "local.settings.json", "node_modules"]
      : context.core === "lib"
        ? [".next", "bin", "dist", "node_modules", "*.tgz"]
        : [".env*.local", ".next", "dist", "node_modules"];
}
