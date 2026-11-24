import { type Config } from "eslint/config";

export type Input = {
  /**
   * An object with the plugins to be ignored.
   */
  ignorePlugins?: {
    /**
     * The next plugin.
     */
    next?: true;

    /**
     * The prettier plugin.
     */
    prettier?: true;

    /**
     * The projectStructure plugin.
     */
    projectStructure?: true;

    /**
     * The react plugin.
     */
    react?: true;

    /**
     * The sort plugin.
     */
    sort?: true;

    /**
     * The typescript plugin.
     */
    typescript?: true;
  };
} & (
  | {
      /**
       * The core type of the package.
       */
      core: "app";

      /**
       * The types of the store to be used.
       */
      store?: "default" | "redux-observable";
    }
  | {
      /**
       * The core type of the package.
       */
      core: "azure-func" | "lib" | "node";
    }
);

export type Output = Config[];
