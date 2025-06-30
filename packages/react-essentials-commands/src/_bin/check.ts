import { execute } from "#src/utils";

import run from "./_run";

export default async function check(): Promise<void> {
  await run("check", () =>
    execute(
      "next lint --cache-location ./node_modules/.eslintcache --cache-strategy content --max-warnings 0 --dir .",
      true,
    ),
  );
}

check();
