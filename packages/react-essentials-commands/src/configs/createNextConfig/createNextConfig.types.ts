import { type NextConfig } from "next";

import { type Func, type GetPackageJSONTypes } from "#src/utils";

export type Input = [
  /**
   * The core type of the package, which can be one of:
   * - "app": for web applications
   */
  core: Extract<NonNullable<GetPackageJSONTypes.Response["core"]>, "app">,

  /**
   * Optional configurations for the webpack setup.
   */
  configs?: Partial<Pick<NextConfig, "webpack">>,
];

export type Output = Func<NextConfig, [phase: string]>;
