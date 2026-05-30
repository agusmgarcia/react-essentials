import { type Configuration } from "webpack";

export type Input = {
  /**
   * Alias configuration for module resolution.
   */
  alias?: (target: "node") => Record<string, string | false | string[]>;

  /**
   * The core type of the package.
   */
  core: "azure-func";

  /**
   * Externals configuration for webpack.
   * This is a static array of strings.
   * It specifies which modules should not be bundled by webpack.
   */
  externals?: string[];
};

export type Output = Configuration[];
