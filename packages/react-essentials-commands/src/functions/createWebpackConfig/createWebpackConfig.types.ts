import { type CreateWebpackConfigAzureFuncTypes } from "./createWebpackConfigAzureFunc";
import { type CreateWebpackConfigLibTypes } from "./createWebpackConfigLib";
import { type CreateWebpackConfigNodeTypes } from "./createWebpackConfigNode";

export type Input =
  | CreateWebpackConfigAzureFuncTypes.Input
  | CreateWebpackConfigLibTypes.Input
  | CreateWebpackConfigNodeTypes.Input;

export type Output =
  | CreateWebpackConfigAzureFuncTypes.Output
  | CreateWebpackConfigLibTypes.Output
  | CreateWebpackConfigNodeTypes.Output;
