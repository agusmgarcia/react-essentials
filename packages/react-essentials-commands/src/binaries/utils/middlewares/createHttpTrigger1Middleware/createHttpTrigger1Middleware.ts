import { createFileMiddleware } from "#src/binaries/utils";

export default createFileMiddleware<string>({
  path: "src/functions/httpTrigger1/index.ts",
  template: getTemplate,
  valid: ["azure-func"],
});

function getTemplate(): string {
  return `import {
  app,
  type HttpRequest,
  type HttpResponseInit,
  type InvocationContext,
} from "@azure/functions";

async function httpTrigger1(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log(\`Http function processed request for url \"\${request.url}"\`);

  const name = request.query.get("name") || (await request.text()) || "world";

  return { body: \`Hello, \${name}!\` };
}

app.http("httpTrigger1", {
  authLevel: "anonymous",
  handler: httpTrigger1,
  methods: ["GET", "POST"],
});
`;
}
