import { type NextConfig } from "next";

import { type Func } from "#src/types";

export type Input = {
  /**
   * The core type of the package.
   */
  core: "app";

  /**
   * Custom webpack configuration for Next.js.
   */
  webpack?: NextConfig["webpack"];
};

export type Output = Func<NextConfig, [phase: string]>;
