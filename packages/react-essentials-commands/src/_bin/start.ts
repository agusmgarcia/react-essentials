import process from "process";

import { args, errors, execute, getPackageJSON } from "#src/utils";

import run from "./_run";

export default async function start(): Promise<void> {
  try {
    const core = await getPackageJSON().then((json) => json.core);

    const argsValue = args.validate("filter", "port", "production");
    const port = argsValue.getString("port");

    if (core === "app")
      await run("start", () =>
        execute(`next dev${!!port ? ` --port ${port}` : ""}`, true),
      );

    if (core === "azure-func")
      await run(
        "start",
        () => execute("del bin dist *.tgz", true),
        () => execute("webpack --mode=development", true),
        () =>
          execute(
            `concurrently -k "func start --port=${port || 3000}" "webpack --mode=development --watch"`,
            true,
          ),
      );

    if (core === "node") {
      await run(
        "start",
        () => execute("del bin dist *.tgz", true),
        () => execute("webpack --mode=development", true),
        () =>
          execute(
            `concurrently -k "NODE_ENV='development' node --watch dist/index.js" "webpack --mode=development --watch"`,
            true,
          ),
      );
    }
  } catch (error) {
    console.error(errors.getMessage(error));
    process.exit(1);
  }
}

start();
