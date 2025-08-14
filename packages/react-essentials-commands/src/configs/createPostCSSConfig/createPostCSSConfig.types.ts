export type Input = [
  /**
   * The core type of the package, which can be one of:
   * - "app": for web applications
   * - "lib": for libraries that can be used in both Node.js and browser environments
   */
  core: "app" | "lib",
];

export type Output = {
  plugins: string[];
};
