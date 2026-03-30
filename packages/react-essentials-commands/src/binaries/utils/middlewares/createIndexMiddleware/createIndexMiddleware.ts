import {
  createFileMiddleware,
  type CreateFileMiddlewareTypes,
} from "#src/binaries/utils";

const BINARIES_UTILS_INDEX_MIDDLEWARE = createFileMiddleware<string>({
  path: "src/binaries/utils/index.ts",
  template: getEmptyIndexTemplate,
  valid: ["lib"],
});

const CLIENTS_INDEX_MIDDLEWARE = createFileMiddleware<string>({
  path: "src/clients/index.ts",
  template: getEmptyIndexTemplate,
  valid: ["app", "azure-func"],
});

const CLASSES_INDEX_MIDDLEWARE = createFileMiddleware<string>({
  path: "src/classes/index.ts",
  template: getEmptyIndexTemplate,
  valid: ["lib"],
});

const COMPONENTS_INDEX_MIDDLEWARE = createFileMiddleware<string>({
  path: "src/components/index.ts",
  template: getEmptyIndexTemplate,
  valid: ["app", "lib"],
});

const FRAGMENTS_INDEX_MIDDLEWARE = createFileMiddleware<string>({
  path: "src/fragments/index.ts",
  template: getEmptyIndexTemplate,
  valid: ["app", "azure-func"],
});

const FUNCTIONS_INDEX_MIDDLEWARE = createFileMiddleware<string>({
  path: "src/functions/index.ts",
  template: getFunctionsIndexTemplate,
  valid: ["azure-func", "lib"],
});

const MODULES_INDEX_MIDDLEWARE = createFileMiddleware<string>({
  path: "src/modules/index.ts",
  template: getEmptyIndexTemplate,
  valid: ["lib"],
});

const OUTPUTS_INDEX_MIDDLEWARE = createFileMiddleware<string>({
  path: "src/outputs/myExportedFunction.ts",
  template: getMyExportedFunctionTemplate,
  valid: ["lib"],
});

const ROOT_INDEX_MIDDLEWARE = createFileMiddleware<string>({
  path: "src/index.ts",
  template: getRootIndexTemplate,
  valid: ["lib", "node"],
});

const STORE_INDEX_MIDDLEWARE = createFileMiddleware<string>({
  path: "src/store/index.ts",
  template: getStoreIndexTemplate,
  valid: ["app"],
});

const UTILS_INDEX_MIDDLEWARE = createFileMiddleware<string>({
  path: "src/utils/index.ts",
  template: getEmptyIndexTemplate,
  valid: ["app", "azure-func", "lib"],
});

export default async function createIndexMiddleware(
  context: CreateFileMiddlewareTypes.Context,
): Promise<void> {
  await Promise.all([
    BINARIES_UTILS_INDEX_MIDDLEWARE(context),
    CLIENTS_INDEX_MIDDLEWARE(context),
    CLASSES_INDEX_MIDDLEWARE(context),
    COMPONENTS_INDEX_MIDDLEWARE(context),
    FRAGMENTS_INDEX_MIDDLEWARE(context),
    FUNCTIONS_INDEX_MIDDLEWARE(context),
    MODULES_INDEX_MIDDLEWARE(context),
    OUTPUTS_INDEX_MIDDLEWARE(context),
    ROOT_INDEX_MIDDLEWARE(context),
    STORE_INDEX_MIDDLEWARE(context),
    UTILS_INDEX_MIDDLEWARE(context),
  ]);
}

function getEmptyIndexTemplate(): string {
  return `
`;
}

function getFunctionsIndexTemplate(
  context: CreateFileMiddlewareTypes.Context,
): string {
  return context.core === "azure-func"
    ? `import { app } from "@azure/functions";

app.setup({
  enableHttpStream: true,
});
`
    : `
`;
}

function getMyExportedFunctionTemplate(): string {
  return `export default function myExportedFunction(): void {
  console.log("My Function");
}
`;
}

function getRootIndexTemplate(
  context: CreateFileMiddlewareTypes.Context,
): string {
  return context.core === "lib"
    ? `import "./index.css";
`
    : `console.log("Hello world");
`;
}

function getStoreIndexTemplate(): string {
  return `import { createReactStore } from "@agusmgarcia/react-essentials-store";

const reactStore = createReactStore({
  slices: {},
});

export const StoreProvider = reactStore.StoreProvider;

const useSelector = reactStore.useSelector;
`;
}
