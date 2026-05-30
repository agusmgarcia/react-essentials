import { type Configuration } from "webpack";

export type Input = {
  /**
   * Alias configuration for module resolution.
   */
  alias?: (target: "node" | "web") => Record<string, string | false | string[]>;

  /**
   * The core type of the package.
   */
  core: "lib";

  /**
   * Externals configuration for webpack.
   * It specifies which modules should not be bundled by webpack.
   */
  externals?: string[];
};

export type Output = Configuration[];
