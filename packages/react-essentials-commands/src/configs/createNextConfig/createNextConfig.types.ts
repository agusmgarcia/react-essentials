import { type NextConfig } from "next";

import { type Func, type getPackageJSON } from "#src/utils";

export type Input = [
  /**
   * The core type of the package, which can be one of:
   * - "app": for web applications
   */
  core: Extract<
    NonNullable<Awaited<ReturnType<typeof getPackageJSON>>["core"]>,
    "app"
  >,
  /**
   * An optional config object or a function that returns a config object.
   * If provided, it can be a partial Next.js configuration or a function that takes the
   * current phase as an argument and returns a partial Next.js configuration.
   */
  configs?: Partial<NextConfig> | Func<Partial<NextConfig>, [phase: string]>,
];

export type Output = Func<NextConfig, [phase: string]>;
