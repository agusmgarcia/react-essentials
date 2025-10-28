const {
  createPrettierConfig,
} = require("@agusmgarcia/react-essentials-commands");

module.exports = createPrettierConfig("lib", { disableTailwind: true });
