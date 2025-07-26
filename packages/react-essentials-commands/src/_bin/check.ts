import { execute } from "#src/utils";

import run from "./_run";

export default async function check(): Promise<void> {
  await run(
    "check",
    () =>
      execute(
        "next lint --cache-location ./node_modules/.eslintcache --cache-strategy content --dir .",
        true,
      ),
    () =>
      execute(
        "prettier . --cache --cache-location ./node_modules/.prettiercache --cache-strategy content --check",
        true,
      ),
    () => execute("tsc --pretty --noEmit", true),
  );
}

check();
