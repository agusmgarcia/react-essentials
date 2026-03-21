import { files } from "#src/modules";

export default async function createTailwindConfigMiddleware(): Promise<void> {
  await Promise.all([
    files.removeFile("tailwind.config.js"),
    files.removeFile("tailwind.config.mjs"),
    files.removeFile("tailwind.config.ts"),
  ]);
}
