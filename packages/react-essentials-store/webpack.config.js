const {
  createWebpackConfig,
} = require("@agusmgarcia/react-essentials-commands");

module.exports = createWebpackConfig("lib", { omit: "node" });
