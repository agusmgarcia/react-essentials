import { type Config } from "prettier";
import { type PluginOptions } from "prettier-plugin-tailwindcss";

export type Input = {
  /**
   * The core type of the package.
   */
  core: "app" | "azure-func" | "lib" | "node";

  /**
   * To disable tailwind plugin.
   */
  disableTailwind?: boolean;
};

export type Output = Config & PluginOptions;
