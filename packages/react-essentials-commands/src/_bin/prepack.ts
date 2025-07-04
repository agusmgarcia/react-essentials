import process from "process";

import { errors, execute, getPackageJSON } from "#src/utils";

import run from "./_run";

export default async function prepack(): Promise<void> {
  try {
    const core = await getPackageJSON().then((json) => json.core);
    if (core !== "lib") return;

    await run(
      "prepack",
      () => execute("del bin dist *.tgz", true),
      () => execute("webpack --mode=production", true),
      () => execute("cpy README.md CHANGELOG.md ../.. --cwd=.github", true),
    );
  } catch (error) {
    console.error(errors.getMessage(error));
    process.exit(1);
  }
}

prepack();
