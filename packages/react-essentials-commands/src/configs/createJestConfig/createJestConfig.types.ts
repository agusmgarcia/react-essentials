import type nextJest from "next/jest";

import { type getPackageJSON } from "#src/utils";

export type Input = [
  core: NonNullable<Awaited<ReturnType<typeof getPackageJSON>>["core"]>,
];

export type Output = ReturnType<ReturnType<typeof nextJest>>;
