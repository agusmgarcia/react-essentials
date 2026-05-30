const { createPrettierConfig } = require("./dist/index.node");

module.exports = createPrettierConfig({ core: "lib", disableTailwind: true });
