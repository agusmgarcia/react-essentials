import { type NextConfig } from "next";

import { type Func, type getPackageJSON } from "#src/utils";

export type Input = [
  core: NonNullable<Awaited<ReturnType<typeof getPackageJSON>>["core"]>,
];

export type Output = Func<NextConfig, [phase: string]>;
