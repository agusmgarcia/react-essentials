import { defineConfig } from "vitest/config";

import { type Input, type Output } from "./createVitestConfig.types";

/**
 * Generates a Vitest configuration object tailored for the project type.
 *
 * @param core - The core type of the project, which determines specific Vitest settings.
 *               Supported values: "app", "azure-func", "lib", "node".
 * @returns A Vitest configuration object compatible with the specified core type.
 */
export default function createVitestConfig(input: Input): Output {
  const cwd = process.cwd();

  return defineConfig({
    resolve: {
      alias:
        input.core === "app"
          ? {
              "#public": `${cwd}/public`,
              "#src": `${cwd}/src`,
            }
          : {
              "#src": `${cwd}/src`,
            },
    },
    test: {
      clearMocks: true,
      passWithNoTests: true,
      ...(input.core === "app"
        ? {
            environment: "jsdom",
            include: ["src/**/*.test.ts?(x)"],
          }
        : input.core === "azure-func"
          ? {
              environment: "node",
              include: ["src/**/*.test.ts"],
            }
          : input.core === "lib"
            ? {
                environment: "node",
                include: ["src/**/*.test.ts?(x)"],
              }
            : {
                environment: "node",
                include: ["src/**/*.test.ts"],
              }),
    },
  });
}
