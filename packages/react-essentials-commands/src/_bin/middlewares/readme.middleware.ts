import { strings } from "#src/utils";

import createFileMiddleware from "./createFileMiddleware";
import { type Context } from "./Middleware.types";

export default createFileMiddleware<string>({
  path: ".github/README.md",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

function getTemplate(context: Context): string {
  return `# ${
    context.name
      .split("/")
      .at(-1)
      ?.split("-")
      .map((i) => strings.capitalize(i))
      .join(" ") || ""
  }`;
}
