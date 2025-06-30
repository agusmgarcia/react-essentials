import fs from "fs";

/**
 * Reads the contents of a folder asynchronously.
 *
 * @param path - The path to the folder to read.
 * @returns A promise that resolves to an array of file and folder names in the specified directory.
 *          If the folder does not exist, resolves with an empty array.
 */
export async function readFolder(path: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) =>
    fs.readdir(path, { encoding: "utf-8" }, (error, files) =>
      !error || error.code === "ENOENT" ? resolve(files || []) : reject(error),
    ),
  );
}

/**
 * Removes a folder and its contents recursively.
 *
 * @param path - The path to the folder to remove.
 * @returns A promise that resolves when the folder has been removed.
 */
export function removeFolder(path: string): Promise<void> {
  return new Promise<void>((resolve, reject) =>
    fs.rm(path, { force: true, recursive: true }, (error) =>
      !error ? resolve() : reject(error),
    ),
  );
}

/**
 * Removes a folder only if it is empty.
 *
 * @param path - The path to the folder to check and remove if empty.
 * @returns A promise that resolves when the folder has been removed or if it was not empty.
 */
export function removeFolderIfEmpty(path: string): Promise<void> {
  return readFolder(path)
    .then((files) => !files.length)
    .then((empty) => (empty ? removeFolder(path) : Promise.resolve()));
}

/**
 * Ensures that a folder exists at the specified path, creating it if necessary.
 *
 * @param path - The path to the folder to create or ensure exists.
 * @returns A promise that resolves when the folder exists.
 */
export async function upsertFolder(path: string): Promise<void> {
  await new Promise<void>((resolve, reject) =>
    fs.mkdir(path, { recursive: true }, (error) =>
      !error || error.code === "EEXIST" ? resolve() : reject(error),
    ),
  );
}
