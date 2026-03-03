import process from "process";

import { execute, getPackageJSON } from "#src/functions";
import { args, errors } from "#src/modules";

import { runCommand } from "./runCommand";

export default async function regenerate(): Promise<void> {
  try {
    const core = await getPackageJSON().then((json) => json.core);
    if (!core)
      throw new Error("'core' property is missing within the 'package.json'");

    const file = args.getStrings("file");

    await runCommand(
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
