import { properties } from "../properties";

export function getMessage(
  error: unknown,
  notFound?: string,
): string | undefined {
  if (typeof error === "undefined") return undefined;
  if (typeof error === "string") return error;
  if (properties.has(error, "message", "string")) return error.message;
  if (properties.has(error, "message", "number"))
    return error.message.toString();
  if (properties.has(error, "message", "boolean"))
    return error.message.toString();
  return notFound || "An unexpected error occurred";
}
