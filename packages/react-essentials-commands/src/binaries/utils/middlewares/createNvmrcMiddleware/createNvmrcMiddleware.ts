import { createFileMiddleware } from "#src/binaries/utils";

export default createFileMiddleware<string>({
  path: ".nvmrc",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

function getTemplate(): string {
  return "22.16";
}
