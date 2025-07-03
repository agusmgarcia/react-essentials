import * as properties from "./properties";

export function getMessage(error: unknown): string;

export function getMessage(error: unknown, notFound: string): string;

export function getMessage(error: unknown, notFound?: string): string {
  if (typeof error === "string") return error;
  if (properties.has(error, "message", "string")) return error.message;
  return notFound || "An unexpected error occurred";
}
