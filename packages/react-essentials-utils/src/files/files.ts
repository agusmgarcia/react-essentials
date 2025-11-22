import fs from "fs";

import { properties } from "../properties";

/**
 * Checks if the given path points to a directory.
 *
 * @param path - The file system path to check.
 * @returns A promise that resolves to `true` if the path is a directory, otherwise `false`.
 * @throws Will reject the promise if an error occurs while accessing the path.
 */
export async function isDirectory(path: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) =>
    fs.stat(path, (error, data) =>
      !error ? resolve(data.isDirectory()) : reject(error),
    ),
  );
}

/**
 * Checks if the given path points to a file.
 *
 * @param path - The file system path to check.
 * @returns A promise that resolves to `true` if the path is a file, otherwise `false`.
 * @throws Will reject the promise if an error occurs while accessing the path.
 */
export function isFile(path: string): Promise<boolean> {
  return new Promise((resolve, reject) =>
    fs.stat(path, (error, stats) =>
      !error ? resolve(stats.isFile()) : reject(error),
    ),
  );
}

/**
 * Reads the contents of a file as a UTF-8 encoded string.
 *
 * @param path - The file system path to read.
 * @returns A promise that resolves to the file contents as a string, or empty `string` if the file does not exist.
 * @throws Will throw if an error occurs other than the file not existing.
 */
export async function readFile(path: string): Promise<string> {
  try {
    return await readRequiredFile(path);
  } catch (error) {
    if (properties.has(error, "code") && error.code === "ENOENT") return "";
    throw error;
  }
}

/**
 * Reads the contents of a file as a UTF-8 encoded string.
 *
 * @param path - The file system path to read.
 * @returns A promise that resolves to the file contents as a string.
 * @throws Will reject the promise if the file does not exist or another error occurs.
 */
export function readRequiredFile(path: string): Promise<string> {
  return new Promise<string>((resolve, reject) =>
    fs.readFile(path, { encoding: "utf-8" }, (error, data) =>
      !error ? resolve(data) : reject(error),
    ),
  );
}

/**
 * Removes a file or directory at the specified path.
 *
 * @param path - The file system path to remove.
 * @returns A promise that resolves when the file or directory has been removed.
 * @throws Will reject the promise if an error occurs during removal.
 */
export function removeFile(path: string): Promise<void> {
  return new Promise<void>((resolve, reject) =>
    fs.rm(path, { force: true, recursive: true }, (error) =>
      !error ? resolve() : reject(error),
    ),
  );
}

/**
 * Creates or overwrites a file with the specified data as UTF-8 encoded text.
 *
 * @param path - The file system path to write to.
 * @param data - The string data to write to the file.
 * @returns A promise that resolves when the file has been written.
 * @throws Will reject the promise if an error occurs during writing.
 */
export async function upsertFile(path: string, data: string): Promise<void> {
  return new Promise<void>((resolve, reject) =>
    fs.writeFile(path, data, { encoding: "utf-8", flag: "w+" }, (error) =>
      !error ? resolve() : reject(error),
    ),
  );
}
