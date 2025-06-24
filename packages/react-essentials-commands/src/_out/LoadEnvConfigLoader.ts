import { type LoaderContext } from "webpack";

import essentialsPackageJSON from "../../package.json";

export default function LoadEnvConfigLoader(
  this: LoaderContext<{}>,
  source: string,
): string {
  return `// @ts-ignore
import "${essentialsPackageJSON.name}/loadEnvConfig";
${source}`;
}
