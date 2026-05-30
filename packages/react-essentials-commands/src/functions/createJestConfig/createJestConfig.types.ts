import { type Config } from "jest";

export type Input = {
  /**
   * The core type of the package.
   */
  core: "app" | "azure-func" | "lib" | "node";

  /**
   * Externals configuration for jest.
   * This is a static array of strings.
   * It specifies which modules should be converted by jest.
   */
  externals?: string[];
};

export type Output = Config;
