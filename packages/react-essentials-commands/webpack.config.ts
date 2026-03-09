import { createWebpackConfig } from "./src/configs";

export default createWebpackConfig("lib", {
  externals: [
    "eslint/config",
    "eslint-config-next/core-web-vitals",
    "eslint-config-next/typescript",
    "eslint-plugin-prettier/recommended",
    "next/constants",
    "next/jest",
  ],
  omit: "web",
});
