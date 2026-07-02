import { createFileMiddleware } from "#src/binaries/createFileMiddleware";

export default createFileMiddleware({
  path: "types.d.ts",
  template: getTemplate,
  valid: ["lib"],
});

function getTemplate(): string {
  return `/// <reference types="next" />
`;
}
