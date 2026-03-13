import { createFileMiddleware } from "#src/binaries/utils";

export default createFileMiddleware<string>({
  path: "pages/_app.css",
  template: getTemplate,
  valid: ["app"],
});

function getTemplate(): string {
  return `@import "tailwindcss";
`;
}
