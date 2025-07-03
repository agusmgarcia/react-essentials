import hasProperty from "./hasProperty";

export default function getErrorMessage(error: unknown): string | undefined;

export default function getErrorMessage(
  error: unknown,
  notFound: string,
): string;

export default function getErrorMessage(
  error: unknown,
  notFound?: string | undefined,
): string | undefined {
  if (typeof error === "string") return error;
  if (hasProperty(error, "message", "string")) return error.message;
  return notFound || "An unexpected error occurred";
}
