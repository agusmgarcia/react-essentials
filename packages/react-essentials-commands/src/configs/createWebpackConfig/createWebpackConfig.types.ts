import { type Configuration } from "webpack";

import { type Func, type getPackageJSON } from "#src/utils";

export type Input =
  | [
      /**
       * The core type of the package, which can be one of:
       * - "lib": for libraries that can be used in both Node.js and browser environments
       */
      core: Extract<
        NonNullable<Awaited<ReturnType<typeof getPackageJSON>>["core"]>,
        "lib"
      >,

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
              [target: "binaries" | "node" | "web"]
            >;

        /**
         * Externals configuration for webpack.
         * This can be a static array of strings or a function that returns an array based on
         * the target environment (binaries, node, or web).
         * - `binaries`: For binary targets, such as CLI tools.
         * - `node`: For Node.js targets.
         * - `web`: For web targets.
         * It specifies which modules should not be bundled by webpack.
         */
        externals:
          | string[]
          | Func<string[], [target: "binaries" | "node" | "web"]>;

        /**
         * Omit configuration for the webpack setup.
         * This specifies which environments to omit from the configuration.
         * - `node`: Omit Node.js specific configurations.
         * - `web`: Omit web specific configurations.
         */

        omit: "node" | "web";
      }>,
    ]
  | [
      /**
       * The core type of the package, which can be one of:
       * - "azure-func": for Azure Functions
       * - "node": for Node.js applications
       */
      core: Extract<
        NonNullable<Awaited<ReturnType<typeof getPackageJSON>>["core"]>,
        "azure-func" | "node"
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
