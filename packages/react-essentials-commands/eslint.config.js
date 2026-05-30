const { createEslintConfig } = require("./dist/index.node");

module.exports = createEslintConfig({ core: "lib" });
