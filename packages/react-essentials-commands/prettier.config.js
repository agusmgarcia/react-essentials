const { createPrettierConfig } = require("./dist");

module.exports = createPrettierConfig("lib", { disableTailwind: true });
