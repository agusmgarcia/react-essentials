import nextJest from "next/jest";

import { type Input, type Output } from "./createJestConfig.types";

/**
 * Generates a Jest configuration object tailored for Next.js projects.
 *
 * @param core - The core type of the project, which determines specific Jest settings.
 *               Supported values typically include "app", "lib", or others.
 * @returns A Jest configuration object compatible with Next.js and the specified core type.
 */
export default function createJestConfig(...[core]: Input): Output {
  const createJestConfig = nextJest({ dir: "./" });

  return createJestConfig({
    cacheDirectory: "node_modules/.jestcache",
    clearMocks: true,
    coverageProvider: "v8",
    moduleNameMapper:
      core === "app"
        ? {
            "^#public/(.*)$": "<rootDir>/public/$1",
            "^#src/(.*)$": "<rootDir>/src/$1",
          }
        : {
            "^#src/(.*)$": "<rootDir>/src/$1",
          },
    testEnvironment: core === "app" || core === "lib" ? "jsdom" : "node",
    testRegex:
      core === "app"
        ? ["pages\\/.*\\.test\\.[jt]sx?$", "src\\/.*\\.test\\.[jt]sx?$"]
        : ["src\\/.*\\.test\\.[jt]sx?$"],
  } as Parameters<typeof createJestConfig>[0]);
}
