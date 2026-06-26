import { type Config } from "eslint/config";

export type Input =
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
    };

export type Output = Config[];
