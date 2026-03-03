import { type Configuration } from "webpack";

import { type GetPackageJSONTypes } from "#src/functions";

export type Input = [
  /**
   * The core type of the package, which can be one of:
   * - "azure-func": for Azure Functions
   * - "node": for Node.js applications
   */
  core: Extract<
    NonNullable<GetPackageJSONTypes.Response["core"]>,
    "azure-func"
  >,

  /**
   * Optional configurations for the webpack setup.
   */
  configs?: Partial<{
    /**
     * Alias configuration for module resolution.
     * This is a static object that returns an object.
     */
    alias: Record<string, string | false | string[]>;

    /**
     * Externals configuration for webpack.
     * This is a static array of strings.
     * It specifies which modules should not be bundled by webpack.
     */
    externals: string[];
  }>,
];

export type Output = Configuration[];
