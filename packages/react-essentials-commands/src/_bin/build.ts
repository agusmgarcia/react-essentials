import process from "process";

import { execute, getErrorMessage, getPackageJSON } from "#src/utils";

import run from "./_run";

export default async function build(): Promise<void> {
  try {
    const core = await getPackageJSON().then((json) => json.core);

    if (core === "app")
      await run(
        "build",
        () => execute("del bin dist *.tgz", true),
        () => execute("next build --no-lint", true),
      );

    if (core === "azure-func")
      await run(
        "build",
        () => execute("del bin dist *.tgz", true),
        () => execute("webpack --mode=production", true),
      );

    if (core === "lib")
      await run(
        "build",
        () => execute("del bin dist *.tgz", true),
        () => execute("webpack --mode=production", true),
      );

    if (core === "node")
      await run(
        "build",
        () => execute("del bin dist *.tgz", true),
        () => execute("webpack --mode=production", true),
      );
  } catch (error) {
    console.error(getErrorMessage(error));
    process.exit(1);
  }
}

build();
