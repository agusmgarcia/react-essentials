import fs from "fs";

import { properties } from "../properties";

export async function isDirectory(path: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) =>
    fs.stat(path, (error, data) =>
      !error ? resolve(data.isDirectory()) : reject(error),
    ),
  );
}

export async function readFile(path: string): Promise<string> {
  try {
    return await readRequiredFile(path);
  } catch (error) {
    if (properties.has(error, "code") && error.code === "ENOENT") return "";
    throw error;
  }
}

export function readRequiredFile(path: string): Promise<string> {
  return new Promise<string>((resolve, reject) =>
    fs.readFile(path, { encoding: "utf-8" }, (error, data) =>
      !error ? resolve(data) : reject(error),
    ),
  );
}

export function removeFile(path: string): Promise<void> {
  return new Promise<void>((resolve, reject) =>
    fs.rm(path, { force: true, recursive: true }, (error) =>
      !error ? resolve() : reject(error),
    ),
  );
}

export async function upsertFile(path: string, data: string): Promise<void> {
  return new Promise<void>((resolve, reject) =>
    fs.writeFile(path, data, { encoding: "utf-8", flag: "w+" }, (error) =>
      !error ? resolve() : reject(error),
    ),
  );
}
