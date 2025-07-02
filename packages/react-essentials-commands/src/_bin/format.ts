import process from "process";

import { execute, getErrorMessage } from "#src/utils";

import run from "./_run";

export default async function format(): Promise<void> {
  try {
    await run("format", () =>
      execute(
        "next lint --cache-location ./node_modules/.eslintcache --cache-strategy content --dir . --fix",
        true,
      ),
    );
  } catch (error) {
    console.error(getErrorMessage(error));
    process.exit(1);
  }
}

format();
