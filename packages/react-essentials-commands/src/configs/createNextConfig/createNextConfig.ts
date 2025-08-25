import { PHASE_PRODUCTION_BUILD } from "next/constants";

import { type Input, type Output } from "./createNextConfig.types";

/**
 * Generates a Next.js configuration object based on the provided input and build phase.
 *
 * @param core - The core type of the project, which determines specific Jest settings.
 * @returns A function that takes the current Next.js build phase and returns a configuration object.
 */
export default function createNextConfig(...[_core]: Input): Output {
  return (phase) => ({
    basePath: process.env.APP_BASE_PATH,
    devIndicators: false,
    distDir: "dist",
    env: Object.keys(process.env).reduce(
      (result, key) => {
        result[key] = key.startsWith("APP_") ? process.env[key] : undefined;
        return result;
      },
      {} as Record<string, string | undefined>,
    ),
    output: phase === PHASE_PRODUCTION_BUILD ? "export" : undefined,
    reactStrictMode: true,
  });
}
