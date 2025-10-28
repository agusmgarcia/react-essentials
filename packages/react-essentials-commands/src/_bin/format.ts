import process from "process";

import { errors, execute } from "#src/utils";

import run from "./_run";

export default async function format(): Promise<void> {
  try {
    await run("format", () =>
      execute(
        "eslint --cache --cache-location ./node_modules/.eslintcache --cache-strategy content --fix .",
        true,
      ),
    );
  } catch (error) {
    console.error(errors.getMessage(error));
    process.exit(1);
  }
}

format();
