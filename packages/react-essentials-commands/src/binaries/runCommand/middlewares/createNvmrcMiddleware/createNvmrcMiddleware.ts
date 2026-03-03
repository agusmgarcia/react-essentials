import { createFileMiddleware } from "../middlewares.utils";

export default createFileMiddleware<string>({
  path: ".nvmrc",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

function getTemplate(): string {
  return "22.16";
}
