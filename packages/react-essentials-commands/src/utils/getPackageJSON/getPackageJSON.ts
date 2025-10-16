import { files } from "../files";
import { type Response } from "./getPackageJSON.types";

export default function getPackageJSON(): Promise<Response> {
  return files
    .readRequiredFile("package.json")
    .then((data) => JSON.parse(data));
}
