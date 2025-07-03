import { type NextConfig } from "next";

import { type Func, type getPackageJSON } from "#src/utils";

export type Input = [
  core: Extract<
    NonNullable<Awaited<ReturnType<typeof getPackageJSON>>["core"]>,
    "app"
  >,
  configs?: Partial<NextConfig> | Func<Partial<NextConfig>, [phase: string]>,
];

export type Output = Func<NextConfig, [phase: string]>;
