import process from "process";

import { args, errors, execute } from "#src/utils";

import run from "./_run";

export default async function test(): Promise<void> {
  try {
    const watch = args.getBoolean("watch");
    const pattern = args.getStrings("pattern");

    await run("test", () =>
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
