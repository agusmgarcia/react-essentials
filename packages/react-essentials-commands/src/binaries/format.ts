import process from "process";

import { execute } from "#src/functions";
import { errors } from "#src/modules";

import { runCommand } from "./runCommand";

export default async function format(): Promise<void> {
  try {
    await runCommand("format", () =>
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
