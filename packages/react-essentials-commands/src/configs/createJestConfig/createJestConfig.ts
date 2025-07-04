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
    testRegex:
      core === "app"
        ? [
            "<rootDir>/pages/**/*.test.[jt]s?(x)",
            "<rootDir>/src/**/*.test.[jt]s?(x)",
          ]
        : core === "azure-func"
          ? ["<rootDir>/src/**/*.test.[jt]s"]
          : core === "lib"
            ? undefined
            : ["<rootDir>/src/**/*.test.[jt]s"],
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
              displayName: "Source",
              testEnvironment: "jsdom",
              testMatch: ["<rootDir>/src/**/*.test.[jt]s?(x)"],
              testPathIgnorePatterns: [
                ...(nextJestConfig.testPathIgnorePatterns || []),
                "<rootDir>/src/_bin/",
                "<rootDir>/node_modules/",
              ],
            },
            {
              ...nextJestConfig,
              displayName: "Binaries",
              testEnvironment: "node",
              testMatch: ["<rootDir>/src/_bin/**/*.test.[jt]s?(x)"],
            },
          ]
        : undefined,
  };
}
