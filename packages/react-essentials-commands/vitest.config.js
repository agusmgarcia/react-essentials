const { createVitestConfig } = require("./dist/index.node");

module.exports = createVitestConfig({ core: "lib" });
