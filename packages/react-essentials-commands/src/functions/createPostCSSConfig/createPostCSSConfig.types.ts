export type Input = {
  /**
   * The core type of the package.
   */
  core: "app" | "lib";
};

export type Output = {
  plugins: string[];
};
