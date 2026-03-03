import process from "process";

import { execute, getPackageJSON } from "#src/functions";
import { errors } from "#src/modules";

import { runCommand } from "./runCommand";

export default async function build(): Promise<void> {
  try {
    const core = await getPackageJSON().then((json) => json.core);

    if (core === "app")
      await runCommand(
        "build",
        () => execute("del bin dist *.tgz", true),
        () => execute("next build --webpack", true),
      );

    if (core === "azure-func")
      await runCommand(
        "build",
        () => execute("del bin dist *.tgz", true),
        () => execute("webpack --mode=production", true),
      );

    if (core === "lib")
      await runCommand(
        "build",
        () => execute("del bin dist *.tgz", true),
        () => execute("webpack --mode=production", true),
      );

    if (core === "node")
      await runCommand(
        "build",
        () => execute("del bin dist *.tgz", true),
        () => execute("webpack --mode=production", true),
      );
  } catch (error) {
    console.error(errors.getMessage(error));
    process.exit(1);
  }
}

build();
