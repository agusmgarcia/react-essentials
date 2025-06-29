import { PHASE_PRODUCTION_BUILD } from "next/constants";

import { type Input, type Output } from "./createNextConfig.types";

/**
 * Generates a Next.js configuration object based on the provided input and build phase.
 *
 * @param core - The core type of the project, which determines specific Jest settings.
 *               Supported values typically include "app", "lib", or others.
 * @returns A function that takes the current Next.js build phase and returns a configuration object.
 */
export default function createNextConfig(...[_core, configs]: Input): Output {
  return (phase) => ({
    basePath: process.env.NEXT_PUBLIC_BASE_PATH,
    devIndicators: false,
    distDir: "dist",
    output: phase === PHASE_PRODUCTION_BUILD ? "export" : undefined,
    reactStrictMode: true,
    ...(typeof configs === "function" ? configs(phase) : configs),
  });
}
