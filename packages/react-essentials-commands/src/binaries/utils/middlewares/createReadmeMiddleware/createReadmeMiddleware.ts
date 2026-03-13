import {
  createFileMiddleware,
  type CreateFileMiddlewareTypes,
} from "#src/binaries/utils";
import { strings } from "#src/modules";

export default createFileMiddleware<string>({
  path: ".github/README.md",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

function getTemplate(context: CreateFileMiddlewareTypes.Context): string {
  return `# ${
    context.name
      .split("/")
      .at(-1)
      ?.split("-")
      .map((i) => strings.capitalize(i))
      .join(" ") || ""
  }`;
}
