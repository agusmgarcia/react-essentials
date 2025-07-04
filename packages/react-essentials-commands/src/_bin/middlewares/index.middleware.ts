import createFileMiddleware from "./createFileMiddleware";
import { type Context } from "./Middleware.types";

export default createFileMiddleware<string>({
  path: "src/index.ts",
  template: getTemplate,
  valid: ["azure-func", "lib", "node"],
});

function getTemplate(context: Context): string {
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
