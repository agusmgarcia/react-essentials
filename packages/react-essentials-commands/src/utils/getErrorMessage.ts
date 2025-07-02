import hasProperty from "./hasProperty";

export default function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (hasProperty(error, "message", "string")) return error.message;
  return "Not deserializable error";
}
