import { type getPackageJSON } from "#src/utils";

export type Input = [
  core: NonNullable<Awaited<ReturnType<typeof getPackageJSON>>["core"]>,
];

export type Output = {
  extends: string[];
  ignorePatterns: string[];
  plugins: string[];
  rules: Record<
    string,
    "error" | "warning" | "off" | ["error" | "off" | "warning", ...any[]]
  >;
};
