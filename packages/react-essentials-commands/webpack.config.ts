import { createWebpackConfig } from "./src/configs";

export default createWebpackConfig("lib", { omit: "web" });
