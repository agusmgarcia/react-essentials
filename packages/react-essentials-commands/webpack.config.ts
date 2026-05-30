import { createWebpackConfig } from "./src";

export default createWebpackConfig({
  core: "lib",
  externals: [
    "eslint/config",
    "eslint-config-next/core-web-vitals",
    "eslint-config-next/typescript",
    "eslint-plugin-prettier/recommended",
    "next/constants",
    "next/jest",
  ],
});
