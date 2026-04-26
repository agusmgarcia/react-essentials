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
  ...[core, configs]: Input
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

  const transformIgnorePatterns = mergeTransformIgnorePatterns(
    nextJestConfig.transformIgnorePatterns,
    [...(configs?.externals || []), "uuid"],
  );

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
              transformIgnorePatterns,
            },
            {
              ...nextJestConfig,
              displayName: "Source",
              testEnvironment: "node",
              testMatch: [
                "<rootDir>/src/**/*.test.ts",
                "!<rootDir>/src/components/**/*.test.ts?(x)",
              ],
              transformIgnorePatterns,
            },
          ]
        : undefined,
    transformIgnorePatterns,
  };
}

/**
 * Merges external module names into existing transformIgnorePatterns so that
 * the specified externals are NOT ignored (i.e., they get transformed by Jest).
 *
 * Jest ignores a file if it matches ANY pattern in transformIgnorePatterns.
 * Simply appending `/node_modules/(?!ext)` doesn't work because the existing
 * Next.js pattern `/node_modules/(?!...)` already matches the external.
 * Instead, we inject the external names into each existing node_modules pattern.
 */
function mergeTransformIgnorePatterns(
  patterns: string[] | undefined,
  externals: string[],
): string[] {
  if (!patterns || !externals.length) return patterns || [];

  const externalGroup = externals.join("|");

  return patterns.map((pattern) => {
    // Match patterns like /node_modules/(?!...) and inject our externals
    // into the negative lookahead so they are also excluded from being ignored.
    if (pattern.includes("/node_modules") && pattern.includes("(?!"))
      return pattern.replace(/\(\?!/g, `(?!${externalGroup}|`);

    // For a plain /node_modules/ pattern without negative lookahead,
    // add one that excludes the externals.
    if (/\/node_modules\/?$/.test(pattern))
      return `${pattern.replace(/\/?$/, "")}(?![\\\\/](${externalGroup})[\\\\/])`;

    return pattern;
  });
}
