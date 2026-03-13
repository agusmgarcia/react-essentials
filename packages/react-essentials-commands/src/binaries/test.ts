import process from "process";

import { runCommand } from "#src/binaries/utils";
import { execute } from "#src/functions";
import { args, errors } from "#src/modules";

export default async function test(): Promise<void> {
  try {
    const watch = args.getBoolean("watch");
    const pattern = args.getStrings("pattern");

    await runCommand("test", () =>
      execute(
        `jest --passWithNoTests${watch ? " --watch" : ""}${pattern.length ? ` ${pattern.join(" ")}` : ""}`,
        true,
      ),
    );
  } catch (error) {
    console.error(errors.getMessage(error));
    process.exit(1);
  }
}

test();
