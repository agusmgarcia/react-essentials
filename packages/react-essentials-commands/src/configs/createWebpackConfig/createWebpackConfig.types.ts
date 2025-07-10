import { type Configuration } from "webpack";

import { type Func, type getPackageJSON } from "#src/utils";

export type Input =
  | [
      core: Extract<
        NonNullable<Awaited<ReturnType<typeof getPackageJSON>>["core"]>,
        "lib"
      >,
      configs?: Partial<{
        alias:
          | Record<string, string | false | string[]>
          | Func<
              Record<string, string | false | string[]>,
              [target: "binaries" | "node" | "web"]
            >;
        externals:
          | string[]
          | Func<string[], [target: "binaries" | "node" | "web"]>;
        omit: "node" | "web";
      }>,
    ]
  | [
      core: Extract<
        NonNullable<Awaited<ReturnType<typeof getPackageJSON>>["core"]>,
        "azure-func" | "node"
      >,
      configs?: Partial<{
        alias: Record<string, string | false | string[]>;
        externals: string[];
      }>,
    ];

export type Output = Configuration[];
