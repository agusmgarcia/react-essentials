import {
  createFileMiddleware,
  type CreateFileMiddlewareTypes,
} from "#src/binaries/utils";

export default createFileMiddleware<string>({
  path: (context) =>
    context.core === "azure-func" ? "src/functions/index.ts" : "src/index.ts",
  template: getTemplate,
  valid: ["azure-func", "lib", "node"],
});

function getTemplate(context: CreateFileMiddlewareTypes.Context): string {
  return context.core === "azure-func"
    ? `import { app } from "@azure/functions";

app.setup({
  enableHttpStream: true,
});
`
    : context.core === "lib"
      ? `import "./index.css";
`
      : "";
}
