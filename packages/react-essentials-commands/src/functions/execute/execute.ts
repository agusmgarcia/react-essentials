import { spawn } from "child_process";

import { emptyFunction } from "#src/functions";
import { type Func } from "#src/types";

import { type Options } from "./execute.types";

export default function execute(
  command: string,
  disassociated: true,
  options?: Partial<Options>,
): Promise<void>;

export default function execute(
  command: string,
  disassociated: false,
  options?: Partial<Options>,
): Promise<string>;

export default function execute(
  command: string,
  disassociated: boolean,
  options?: Partial<Options>,
): Promise<void | string> {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = parseCommandAndArgs(
      command,
      !!options?.excludeQuotes,
    );

    const child = spawn(cmd, args, {
      shell: process.platform === "win32" ? true : undefined,
      stdio: disassociated === true ? "inherit" : "pipe",
    });

    const listeners = new Array<Func>();

    let stdout = "";
    let stderr = "";
    let error: Error | undefined = undefined;

    listeners.push(
      (function (): Func {
        if (!child.stdout) return emptyFunction;
        const handle = (data: Buffer) => (stdout += data.toString());
        const listener = child.stdout.on("data", handle);
        return () => listener.removeListener("data", handle);
      })(),
    );

    listeners.push(
      (function (): Func {
        if (!child.stderr) return emptyFunction;
        const handle = (data: Buffer) => (stderr += data.toString());
        const listener = child.stderr.on("data", handle);
        return () => listener.removeListener("data", handle);
      })(),
    );

    listeners.push(
      (function (): Func {
        const handle = (e: Error) => (error = e);
        const listener = child.on("error", handle);
        return () => listener.removeListener("error", handle);
      })(),
    );

    listeners.push(
      (function (): Func {
        function handle(code: number | null, signal: NodeJS.Signals | null) {
          listeners.forEach((unlisten) => unlisten());

          if (typeof code === "number" && !code) {
            resolve(!!stdout ? stdout : undefined);
            return;
          }

          if (!!signal) {
            reject(
              new Error(
                `Command ${command} was terminated by signal ${signal}`,
              ),
            );
            return;
          }

          reject(
            !!stderr
              ? new Error(stderr)
              : !!error
                ? error
                : new Error(`Command ${command} exit with code ${code}`),
          );
        }

        const listener = child.on("close", handle);
        return () => listener.removeListener("close", handle);
      })(),
    );
  });
}

function parseCommandAndArgs(
  command: string,
  excludeQuotes: boolean,
): string[] {
  const result = new Array<string>();

  let element = "";
  let inSingleQuotes = false;
  let inDoubleQuotes = false;
  let escapeNext = false;

  for (let i = 0; i < command.length; i++) {
    const char = command[i];

    if (escapeNext) {
      element += char;
      escapeNext = false;
      continue;
    }

    if (char === "\\") {
      escapeNext = true;
      continue;
    }

    if (char === "'" && !inDoubleQuotes) {
      inSingleQuotes = !inSingleQuotes;
      if (!excludeQuotes) element += char;
      continue;
    }

    if (char === '"' && !inSingleQuotes) {
      inDoubleQuotes = !inDoubleQuotes;
      if (!excludeQuotes) element += char;
      continue;
    }

    if (char === " " && !inSingleQuotes && !inDoubleQuotes) {
      if (!!element) {
        result.push(element);
        element = "";
      }
      continue;
    }

    element += char;
  }

  if (!!element) result.push(element);

  return result;
}
