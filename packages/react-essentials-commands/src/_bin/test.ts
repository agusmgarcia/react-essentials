import process from "process";

import { args, errors, execute } from "#src/utils";

import run from "./_run";

export default async function test(): Promise<void> {
  try {
    const argsValue = args.validate("pattern", "filter", "watch");
    const watch = argsValue.getBoolean("watch");
    const pattern = argsValue.get("pattern");

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
