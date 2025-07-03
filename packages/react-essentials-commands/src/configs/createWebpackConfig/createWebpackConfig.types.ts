import { type Configuration } from "webpack";

import { type getPackageJSON } from "#src/utils";

export type Input =
  | [
      core: Extract<
        NonNullable<Awaited<ReturnType<typeof getPackageJSON>>["core"]>,
        "lib"
      >,
      configs?: Partial<{ externals: string[]; omit: "node" | "web" }>,
    ]
  | [
      core: Extract<
        NonNullable<Awaited<ReturnType<typeof getPackageJSON>>["core"]>,
        "azure-func" | "node"
      >,
      configs?: Partial<{ externals: string[] }>,
    ];

export type Output = Configuration[];
