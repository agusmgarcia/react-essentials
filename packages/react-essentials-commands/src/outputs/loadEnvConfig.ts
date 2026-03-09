import { loadEnvConfig } from "@next/env";

const NODE_ENV: string = "NODE_ENV";

loadEnvConfig(
  process.cwd(),
  process.env[NODE_ENV] === "development"
    ? true
    : process.env[NODE_ENV] === "test"
      ? undefined
      : false,
);
