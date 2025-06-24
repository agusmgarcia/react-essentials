import { createWebpackConfig } from "./src/configs";

export default createWebpackConfig("lib", {
  externals: ["next/constants", "next/jest"],
  omit: "web",
});
