import { execute } from "#src/utils";

import run from "./_run";

export default async function format(): Promise<void> {
  await run(
    "format",
    () =>
      execute(
        "next lint --cache-location ./node_modules/.eslintcache --cache-strategy content --dir . --fix",
        true,
      ),
    () =>
      execute(
        "prettier . --cache --cache-location ./node_modules/.prettiercache --cache-strategy content --write",
        true,
      ),
  );
}

format();
