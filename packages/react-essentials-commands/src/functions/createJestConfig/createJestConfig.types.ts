import { type Config } from "jest";

import { type GetPackageJSONTypes } from "#src/functions";

export type Input = [
  /**
   * The core type of the package, which can be one of:
   * - "app": for web applications
   * - "lib": for libraries that can be used in both Node.js and browser environments
   * - "azure-func": for Azure Functions
   * - "node": for Node.js applications
   */
  core: NonNullable<GetPackageJSONTypes.Response["core"]>,

  /**
   * Optional configurations for the jest setup.
   */
  configs?: Partial<{
    /**
     * Externals configuration for jest.
     * This is a static array of strings.
     * It specifies which modules should be converted by jest.
     */
    externals: string[];
  }>,
];

export type Output = Config;
