import { strings } from "#src/modules";

import { type Context, createFileMiddleware } from "../middlewares.utils";

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
