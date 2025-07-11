import process from "process";

import { args, errors, execute, getPackageJSON } from "#src/utils";

import run from "./_run";

export default async function regenerate(): Promise<void> {
  try {
    const core = await getPackageJSON().then((json) => json.core);
    if (!core)
      throw new Error("'core' property is missing within the 'package.json'");

    const file = args.getStrings("file");

    await run(
      "regenerate",
      () => execute("echo Regenerating files...", true),
      () =>
        !file.length
          ? execute(`del bin dist${core !== "app" ? " pages" : ""} *.tgz`, true)
          : Promise.resolve(),
      () => execute("echo Files regenerated!", true),
    );
  } catch (error) {
    console.error(errors.getMessage(error));
    process.exit(1);
  }
}

regenerate();
