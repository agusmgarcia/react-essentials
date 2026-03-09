import { type LoaderContext } from "webpack";

import packageJSONEssentials from "../../package.json";

/**
 * A custom Webpack loader that prepends an import statement for the `loadEnvConfig` module
 * from the current package before the original source code. This ensures that environment
 * configuration is loaded before any other code in the processed file.
 *
 * @param source - The original source code to be transformed.
 * @returns The modified source code with the import statement prepended.
 */
export default function LoadEnvConfigLoader(
  this: LoaderContext<{}>,
  source: string,
): string {
  return `// @ts-ignore
import "${packageJSONEssentials.name}/loadEnvConfig";
${source}`;
}
