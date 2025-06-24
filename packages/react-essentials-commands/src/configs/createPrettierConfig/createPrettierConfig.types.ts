import { type RequiredOptions } from "prettier";

import { type getPackageJSON } from "#src/utils";

export type Input = [
  core: NonNullable<Awaited<ReturnType<typeof getPackageJSON>>["core"]>,
];

export type Output = Partial<RequiredOptions>;
