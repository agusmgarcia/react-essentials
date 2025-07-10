import { type getPackageJSON } from "#src/utils";

export type Input = [
  /**
   * The core type of the package, which can be one of:
   * - "app": for web applications
   * - "lib": for libraries that can be used in both Node.js and browser environments
   */
  core: Extract<
    NonNullable<Awaited<ReturnType<typeof getPackageJSON>>["core"]>,
    "app" | "lib"
  >,
];

export type Output = {
  plugins: string[];
};
