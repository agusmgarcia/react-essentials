import process from "process";

import { errors, execute } from "#src/utils";

import run from "./_run";

export default async function check(): Promise<void> {
  try {
    await run(
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
