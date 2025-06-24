import { capitalize } from "#src/utils";

import createMiddleware, { type Context } from "./createMiddleware";

export default createMiddleware<string>({
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
      .map((i) => capitalize(i))
      .join(" ") || ""
  }`;
}
