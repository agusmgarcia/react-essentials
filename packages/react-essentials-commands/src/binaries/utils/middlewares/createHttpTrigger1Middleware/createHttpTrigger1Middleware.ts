import {
  createFileMiddleware,
  type CreateFileMiddlewareTypes,
} from "#src/binaries/utils";

const INDEX_MIDDLEWARE = createFileMiddleware<string>({
  path: "src/functions/httpTrigger1/index.ts",
  template: getIndexTemplate,
  valid: ["azure-func"],
});

const ELEMENT_MIDDLEWARE = createFileMiddleware<string>({
  path: "src/functions/httpTrigger1/httpTrigger1.ts",
  template: getElementTemplate,
  valid: ["azure-func"],
});

const TYPES_MIDDLEWARE = createFileMiddleware<string>({
  path: "src/functions/httpTrigger1/httpTrigger1.types.ts",
  template: getTypesTemplate,
  valid: ["azure-func"],
});

export default async function createHttpTrigger1Middleware(
  context: CreateFileMiddlewareTypes.Context,
): Promise<void> {
  await Promise.all([
    INDEX_MIDDLEWARE(context),
    ELEMENT_MIDDLEWARE(context),
    TYPES_MIDDLEWARE(context),
  ]);
}

function getIndexTemplate(): string {
  return `import {
  app,
  type HttpRequest,
  type HttpResponseInit,
  type InvocationContext,
} from "@azure/functions";

import { default as httpTrigger1 } from "./httpTrigger1";

async function handler(
  request: HttpRequest,
  _: InvocationContext,
): Promise<HttpResponseInit> {
  const response = await httpTrigger1({
    name: request.query.get("name") || (await request.text()) || "world",
    url: request.url,
  });

  return { body: response };
}

app.http("httpTrigger1", {
  authLevel: "anonymous",
  handler,
  methods: ["GET", "POST"],
});
`;
}

function getElementTemplate(): string {
  return `import { type Input, type Output } from "./httpTrigger1.types";

export default async function httpTrigger1(input: Input): Promise<Output> {
  console.log(\`Http function processed request for url \"\${input.url}"\`);
  return \`Hello, \${input.name}!\`;
}
`;
}

function getTypesTemplate(): string {
  return `export type Input = {
  name: string;
  url: string;
};

export type Output = string;
`;
}
