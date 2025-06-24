import { type Input, type Output } from "./createPostCSSConfig.types";

/**
 * Creates a PostCSS configuration object.
 *
 * @param core - The core type of the project, which determines specific Jest settings.
 *               Supported values typically include "app", "lib", or others.
 * @returns An object containing the PostCSS plugins configuration, including Tailwind CSS.
 */
export default function createPostCSSConfig(..._input: Input): Output {
  return {
    plugins: ["@tailwindcss/postcss"],
  };
}
