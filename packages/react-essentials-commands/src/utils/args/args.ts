export function getBoolean(name: string): boolean {
  return getString(name) === "true";
}

export function getString(name: string): string | undefined {
  return getStrings(name).at(-1);
}

export function getStrings(name: string): string[] {
  const result = new Array<string>();
  const input = `--${name}`;

  for (let i = 0; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (!arg.startsWith("--")) continue;

    if (arg === input) {
      result.push("true");
      continue;
    }

    if (arg.startsWith(`${input}=`)) {
      result.push(arg.replace(`${input}=`, ""));
      continue;
    }
  }

  return result;
}
