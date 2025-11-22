import { getPackageJSON } from "#src/utils";

import createWebpackConfigAzureFunc from "./createWebpackConfig.azure-func";
import createWebpackConfigLib from "./createWebpackConfig.lib";
import createWebpackConfigNode from "./createWebpackConfig.node";
import { type Input, type Output } from "./createWebpackConfig.types";

/**
 * Asynchronously generates a Webpack configuration array based on the provided core type and configuration options.
 *
 * This function supports multiple build targets, including Azure Functions, libraries (with optional web/node outputs),
 * and CLI binaries. It dynamically constructs entry points, externals, module rules, output settings, plugins, and resolve options
 * according to the detected project structure and provided configuration.
 *
 * @param core - The build target type, such as "azure-func" or "lib".
 * @param configs - Optional configuration overrides and additional settings.
 * @returns A Promise that resolves to an array of Webpack configuration objects tailored to the specified build target.
 *
 * @remarks
 * - For "azure-func", it creates entries for each function in `src/functions` and an index entry.
 * - For "lib", it can output both web and node builds, and optionally CLI binaries from `src/_bin`.
 * - Handles TypeScript and CSS processing, and manages externals based on dependencies and peerDependencies.
 * - Applies custom TypeScript path transformers and supports UMD library output.
 */
export default async function createWebpackConfig(
  ...input: Input
): Promise<Output> {
  const packageJSON = await getPackageJSON();

  if (input[0] === "azure-func")
    return await createWebpackConfigAzureFunc(input, packageJSON);

  if (input[0] === "lib")
    return await createWebpackConfigLib(input, packageJSON);

  return await createWebpackConfigNode(input, packageJSON);
}
