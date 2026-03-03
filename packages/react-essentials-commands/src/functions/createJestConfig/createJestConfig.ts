import nextJest from "next/jest";

import { type Input, type Output } from "./createJestConfig.types";

/**
 * Generates a Jest configuration object tailored for Next.js projects.
 *
 * @param core - The core type of the project, which determines specific Jest settings.
 *               Supported values typically include "app", "lib", or others.
 * @returns A Jest configuration object compatible with Next.js and the specified core type.
 */
export default async function createJestConfig(
  ...[core]: Input
): Promise<Output> {
  const createNextJestConfig = nextJest({ dir: "./" })({
    cacheDirectory: "node_modules/.jestcache",
    clearMocks: true,
    displayName: core !== "lib" ? "Source" : undefined,
    moduleNameMapper:
      core === "app"
        ? {
            "^#public\\/(.*)$": "<rootDir>/public/$1",
            "^#src\\/(.*)$": "<rootDir>/src/$1",
          }
        : {
            "^#src\\/(.*)$": "<rootDir>/src/$1",
          },
    testEnvironment:
      core === "app"
        ? "jsdom"
        : core === "azure-func"
          ? "node"
          : core === "lib"
            ? undefined
            : "node",
    testMatch:
      core === "app"
        ? ["<rootDir>/src/**/*.test.ts?(x)"]
        : core === "azure-func"
          ? ["<rootDir>/src/**/*.test.ts"]
          : core === "lib"
            ? undefined
            : ["<rootDir>/src/**/*.test.ts"],
  });

  const nextJestConfig = await createNextJestConfig();

  return {
    ...nextJestConfig,
    coverageProvider: "v8",
    projects:
      core === "lib"
        ? [
            {
              ...nextJestConfig,
              displayName: "Components",
              testEnvironment: "jsdom",
              testMatch: ["<rootDir>/src/components/**/*.test.ts?(x)"],
            },
            {
              ...nextJestConfig,
              displayName: "Source",
              testEnvironment: "node",
              testMatch: [
                "<rootDir>/src/**/*.test.ts",
                "!<rootDir>/src/components/**/*.test.ts?(x)",
              ],
            },
          ]
        : undefined,
  };
}
