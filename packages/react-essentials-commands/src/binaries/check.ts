import process from "process";

import { execute } from "#src/functions";
import { errors } from "#src/modules";

import { runCommand } from "./runCommand";

export default async function check(): Promise<void> {
  try {
    await runCommand(
      "check",
      () =>
        execute(
          "eslint --cache --cache-location ./node_modules/.eslintcache --cache-strategy content --max-warnings 0 .",
          true,
        ),
      () => execute("tsc --pretty --noEmit", true),
    );
  } catch (error) {
    console.error(errors.getMessage(error));
    process.exit(1);
  }
}

check();
