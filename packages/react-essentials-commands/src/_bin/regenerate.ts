import process from "process";

import { args, execute, getErrorMessage, getPackageJSON } from "#src/utils";

import run from "./_run";

export default async function regenerate(): Promise<void> {
  try {
    const core = await getPackageJSON().then((json) => json.core);
    if (!core)
      throw new Error("'core' property is missing within the 'package.json'");

    const argsValue = args.validate("file", "filter");
    const file = argsValue.get("file");

    console.log("Regenerating files...");
    await run(
      "regenerate",
      () =>
        !file.length
          ? execute(`del bin dist${core !== "app" ? " pages" : ""} *.tgz`, true)
          : Promise.resolve(),
      () => execute("echo Files regenerated!", true),
    );
  } catch (error) {
    console.error(getErrorMessage(error));
    process.exit(1);
  }
}

regenerate();
