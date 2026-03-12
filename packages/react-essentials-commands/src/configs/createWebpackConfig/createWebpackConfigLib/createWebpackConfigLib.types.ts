import { type Configuration } from "webpack";

import { type Func, type GetPackageJSONTypes } from "#src/utils";

export type Input = [
  /**
   * The core type of the package, which can be one of:
   * - "lib": for libraries that can be used in both Node.js and browser environments
   */
  core: Extract<NonNullable<GetPackageJSONTypes.Response["core"]>, "lib">,

  /**
   * Optional configurations for the webpack setup.
   */
  configs?: Partial<{
    /**
     * Alias configuration for module resolution.
     * This can be a static object or a function that returns an object based on the target
     * environment (binaries, node, or web).
     * - `binaries`: For binary targets, such as CLI tools.
     * - `node`: For Node.js targets.
     * - `web`: For web targets.
     */
    alias:
      | Record<string, string | false | string[]>
      | Func<
          Record<string, string | false | string[]>,
          [target: "node" | "web"]
        >;

    /**
     * Externals configuration for webpack.
     * It specifies which modules should not be bundled by webpack.
     */
    externals: string[];
  }>,
];

export type Output = Configuration[];
