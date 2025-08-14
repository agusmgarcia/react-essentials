import { type NextConfig } from "next";

import { type Func } from "#src/utils";

export type Input = [
  /**
   * The core type of the package, which can be one of:
   * - "app": for web applications
   */
  core: "app",
];

export type Output = Func<NextConfig, [phase: string]>;
