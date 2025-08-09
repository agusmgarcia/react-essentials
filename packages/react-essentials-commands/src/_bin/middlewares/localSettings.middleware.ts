import { files, properties } from "#src/utils";

import createFileMiddleware from "./createFileMiddleware";
import { type Context } from "./Middleware.types";

export default createFileMiddleware<Record<string, any>>({
  mapOutput: (output) => properties.sort(output),
  path: "local.settings.json",
  template: getTemplate,
  valid: ["azure-func"],
});

async function getTemplate(context: Context): Promise<Record<string, any>> {
  const localSettings = await files
    .readFile("local.settings.json")
    .then((localSettings) => JSON.parse(localSettings || "{}"));

  return {
    isEncrypted: false,
    values: {
      ...localSettings.values,
      APP_VERSION: context.version,
      FUNCTIONS_EXTENSION_VERSION: "~4",
      FUNCTIONS_WORKER_RUNTIME: "node",
      WEBSITE_NODE_DEFAULT_VERSION: "~22.16.0",
    },
  };
}
