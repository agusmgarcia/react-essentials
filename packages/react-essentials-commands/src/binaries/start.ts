import process from "process";

import { runCommand } from "#src/binaries/utils";
import { execute, getPackageJSON } from "#src/functions";
import { args, errors } from "#src/modules";

export default async function start(): Promise<void> {
  try {
    const core = await getPackageJSON().then((json) => json.core);
    const port = args.getString("port");

    if (core === "app")
      await runCommand("start", () =>
        execute(`next dev${!!port ? ` --port ${port}` : ""} --webpack`, true),
      );

    if (core === "azure-func")
      await runCommand(
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
      await runCommand(
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
