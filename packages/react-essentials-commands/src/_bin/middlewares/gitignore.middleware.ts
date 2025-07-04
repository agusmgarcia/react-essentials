import createFileMiddleware from "./createFileMiddleware";
import { type Context } from "./Middleware.types";

export default createFileMiddleware<string[]>({
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
