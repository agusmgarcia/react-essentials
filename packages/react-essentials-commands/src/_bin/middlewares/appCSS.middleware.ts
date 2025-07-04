import createFileMiddleware from "./createFileMiddleware";

export default createFileMiddleware<string>({
  path: "pages/_app.css",
  template: getTemplate,
  valid: ["app"],
});

function getTemplate() {
  return `@import "tailwindcss";
`;
}
