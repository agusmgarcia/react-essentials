import { type getPackageJSON } from "#src/utils";

export type Input = [
  core: Extract<
    NonNullable<Awaited<ReturnType<typeof getPackageJSON>>["core"]>,
    "app" | "lib"
  >,
];

export type Output = {
  plugins: string[];
};
