import createFileMiddleware from "./createFileMiddleware";

export default createFileMiddleware<string>({
  path: "src/index.css",
  template: getTemplate,
  valid: ["lib"],
});

function getTemplate() {
  return `@import "tailwindcss";
`;
}
