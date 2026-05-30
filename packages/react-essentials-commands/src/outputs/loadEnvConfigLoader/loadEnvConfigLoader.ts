import { type LoaderContext } from "webpack";

/**
 * A custom Webpack loader that prepends an import statement for the `loadEnvConfig` module
 * from the current package before the original source code. This ensures that environment
 * configuration is loaded before any other code in the processed file.
 *
 * @param source - The original source code to be transformed.
 * @returns The modified source code with the import statement prepended.
 */
export default function loadEnvConfigLoader(
  this: LoaderContext<{}>,
  source: string,
): string {
  return `import { loadEnvConfig } from "@next/env";
  
const NODE_ENV: string = "NODE_ENV";
  
loadEnvConfig(
  process.cwd(),
  process.env[NODE_ENV] === "development"
    ? true
    : process.env[NODE_ENV] === "test"
      ? undefined
      : false,
);

${source}
`;
}
