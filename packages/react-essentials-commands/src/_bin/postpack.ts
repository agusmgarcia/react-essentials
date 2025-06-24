import { execute, getPackageJSON } from "#src/utils";

import run from "./_run";

export default async function postpack(): Promise<void> {
  const core = await getPackageJSON().then((json) => json.core);
  if (core !== "lib") return;

  await run("postpack", () =>
    execute(`del bin dist README.md CHANGELOG.md`, true),
  );
}

postpack();
