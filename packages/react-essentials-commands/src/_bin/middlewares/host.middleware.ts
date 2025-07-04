import { properties } from "#src/utils";

import createFileMiddleware from "./createFileMiddleware";

export default createFileMiddleware<Record<string, any>>({
  mapOutput: (output) => properties.sort(output, ["version"]),
  path: "host.json",
  template: getTemplate,
  valid: ["azure-func"],
});

function getTemplate(): Record<string, any> {
  return {
    extensionBundle: {
      id: "Microsoft.Azure.Functions.ExtensionBundle",
      version: "[4.*, 5.0.0)",
    },
    extensions: {
      http: { routePrefix: "" },
    },
    logging: {
      applicationInsights: {
        samplingSettings: {
          excludedTypes: "Request",
          isEnabled: true,
        },
      },
    },
    version: "2.0",
  };
}
