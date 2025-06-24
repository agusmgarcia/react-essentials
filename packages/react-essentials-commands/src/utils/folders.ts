import fs from "fs";

export async function readFolder(path: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) =>
    fs.readdir(path, { encoding: "utf-8" }, (error, files) =>
      !error || error.code === "ENOENT" ? resolve(files || []) : reject(error),
    ),
  );
}

export function removeFolder(path: string): Promise<void> {
  return new Promise<void>((resolve, reject) =>
    fs.rm(path, { force: true, recursive: true }, (error) =>
      !error ? resolve() : reject(error),
    ),
  );
}

export function removeFolderIfEmpty(path: string): Promise<void> {
  return readFolder(path)
    .then((files) => !files.length)
    .then((empty) => (empty ? removeFolder(path) : Promise.resolve()));
}

export async function upsertFolder(path: string): Promise<void> {
  await new Promise<void>((resolve, reject) =>
    fs.mkdir(path, { recursive: true }, (error) =>
      !error || error.code === "EEXIST" ? resolve() : reject(error),
    ),
  );
}
