import { createFileMiddleware } from "#src/binaries/createFileMiddleware";

export default createFileMiddleware<string>({
  path: "src/index.css",
  template: getTemplate,
  valid: ["lib"],
});

function getTemplate(): string {
  return `@import "tailwindcss";
`;
}
