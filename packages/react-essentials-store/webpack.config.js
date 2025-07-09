const {
  createWebpackConfig,
} = require("@agusmgarcia/react-essentials-commands");

module.exports = createWebpackConfig("lib", {
  externals: ["zustand/middleware"],
  omit: "node",
});
