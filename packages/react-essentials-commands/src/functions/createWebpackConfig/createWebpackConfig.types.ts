import { type CreateWebpackConfigAzureFunc } from "./createWebpackConfigAzureFunc";
import { type CreateWebpackConfigLib } from "./createWebpackConfigLib";
import { type CreateWebpackConfigNode } from "./createWebpackConfigNode";

export type Input =
  | CreateWebpackConfigAzureFunc.Input
  | CreateWebpackConfigLib.Input
  | CreateWebpackConfigNode.Input;

export type Output =
  | CreateWebpackConfigAzureFunc.Output
  | CreateWebpackConfigLib.Output
  | CreateWebpackConfigNode.Output;
