import { type Config } from "eslint/config";

import { type GetPackageJSONTypes } from "#src/utils";

export type Input = [
  /**
   * The core type of the package, which can be one of:
   * - "app": for web applications
   * - "lib": for libraries that can be used in both Node.js and browser environments
   * - "azure-func": for Azure Functions
   * - "node": for Node.js applications
   */
  core: NonNullable<GetPackageJSONTypes.Response["core"]>,
];

export type Output = Config[];
