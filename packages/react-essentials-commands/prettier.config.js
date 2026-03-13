const { createPrettierConfig } = require("./dist/index.node");

module.exports = createPrettierConfig("lib", { disableTailwind: true });
