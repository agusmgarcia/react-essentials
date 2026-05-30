import { type Config } from "eslint/config";

export type Input = {
  /**
   * The core type of the package.
   */
  core: "app" | "azure-func" | "lib" | "node";
};

export type Output = Config[];
