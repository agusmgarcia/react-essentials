import createFileMiddleware from "./createFileMiddleware";

export default createFileMiddleware<string>({
  path: "pages/_app.tsx",
  template: getTemplate,
  valid: ["app"],
});

function getTemplate(): string {
  return `import "./_app.css";

import { type AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component }: AppProps<any>) {
  return (
    <>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link
          href={\`\${process.env.APP_BASE_PATH || ""}/favicon.ico\`}
          rel="icon"
          type="image/x-icon"
        />
      </Head>

      <Component />
    </>
  );
}
`;
}
