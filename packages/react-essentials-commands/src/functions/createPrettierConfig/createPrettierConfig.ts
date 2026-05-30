import { type Input, type Output } from "./createPrettierConfig.types";

/**
 * Generates a Prettier configuration object based on the provided core type.
 *
 * @param core - The core type that determines the configuration.
 *               Supported values include "azure-func", "node", "app", and others.
 * @returns An empty object for "azure-func" or "node" core types, or a Prettier configuration object with Tailwind CSS plugin and related settings for other core types.
 */
export default function createPrettierConfig(input: Input): Output {
  if (
    input.core === "azure-func" ||
    input.core === "node" ||
    !!input?.disableTailwind
  )
    return {};

  return {
    plugins: ["prettier-plugin-tailwindcss"],
    tailwindFunctions: ["clsx", "twMerge"],
    tailwindStylesheet:
      input.core === "app" ? "./pages/_app.css" : "./src/index.css",
  };
}
