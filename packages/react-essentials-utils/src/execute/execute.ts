import { spawn } from "child_process";

import { emptyFunction } from "../emptyFunction";
import { type Func } from "../types";

/**
 * Executes a shell command using Node.js child processes.
 *
 * @param command - The shell command to execute.
 * @param disassociated - If `true`, runs the command in a disassociated mode (output is inherited and not captured).
 * @param options - Optional settings.
 * @returns A Promise that resolves to `void`.
 *          The Promise rejects if the command exits with a non-zero code or encounters an error.
 */
export default function execute(
  command: string,
  disassociated: true,
  options?: Partial<ExecuteOptions>,
): Promise<void>;

/**
 * Executes a shell command using Node.js child processes.
 *
 * @param command - The shell command to execute.
 * @param disassociated - If `false`, captures and returns the command's stdout as a string.
 * @param options - Optional settings.
 * @returns A promise that resolves to the command's stdout as a string.
 *          The Promise rejects if the command exits with a non-zero code or encounters an error.
 */
export default function execute(
  command: string,
  disassociated: false,
  options?: Partial<ExecuteOptions>,
): Promise<string>;

export default function execute(
  command: string,
  disassociated: boolean,
  options?: Partial<ExecuteOptions>,
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
      (function () {
        if (!child.stdout) return emptyFunction;
        const handle = (data: Buffer) => (stdout += data.toString());
        const listener = child.stdout.on("data", handle);
        return () => listener.removeListener("data", handle);
      })(),
    );

    listeners.push(
      (function () {
        if (!child.stderr) return emptyFunction;
        const handle = (data: Buffer) => (stderr += data.toString());
        const listener = child.stderr.on("data", handle);
        return () => listener.removeListener("data", handle);
      })(),
    );

    listeners.push(
      (function () {
        const handle = (e: Error) => (error = e);
        const listener = child.on("error", handle);
        return () => listener.removeListener("error", handle);
      })(),
    );

    listeners.push(
      (function () {
        function handle(code: number) {
          listeners.forEach((unlisten) => unlisten());
          if (!code) resolve(!!stdout ? stdout : undefined);
          else
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
  let doubleQuotesEncountered = false;

  for (let i = 0; i < command.length; i++) {
    const char = command[i];

    if (char === " " && !doubleQuotesEncountered) {
      if (!!element) {
        result.push(element);
        element = "";
      }
      continue;
    }

    if (char === '"') {
      doubleQuotesEncountered = !doubleQuotesEncountered;
      if (!excludeQuotes) element += char;
      continue;
    }

    element += char;
  }

  if (!!element) result.push(element);

  return result;
}

/**
 * Optional settings.
 */
type ExecuteOptions = {
  /**
   * If `true`, excludes quotes from parsed command arguments.
   */
  excludeQuotes: boolean;
};
