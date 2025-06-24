export function get(argName: string): string[] {
  const list = new Array<string>();
  const input = `--${argName}`;

  for (let i = 1; i < process.argv.length; i++) {
    const arg = process.argv[i];

    if (arg === input) {
      list.push("true");
      continue;
    }

    if (arg.startsWith(`${input}=`)) {
      list.push(arg.replace(`${input}=`, ""));
      continue;
    }
  }

  return list;
}

export function validate<TArgs extends string>(
  ...args: TArgs[]
): ArgumentsHandler<TArgs> {
  const result = {} as Record<TArgs, string[]>;

  for (let i = 0; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (!arg.startsWith("--")) continue;

    const list = new Array<string>();
    for (let j = 0; j < args.length; j++) {
      const input = `--${args[j]}`;

      if (arg === input) {
        list.push("true");
        continue;
      }

      if (arg.startsWith(`${input}=`)) {
        list.push(arg.replace(`${input}=`, ""));
        continue;
      }
    }

    const argName = arg.split("=")[0].replace("--", "") as TArgs;
    if (!list.length) throw new Error(`Argument '${argName}' is not allowed`);

    if (!result[argName]) result[argName] = list;
    else result[argName].push(...list);
  }

  return new ArgumentsHandler(result);
}

class ArgumentsHandler<TArgs extends string> {
  private readonly args: Record<TArgs, string[]>;

  constructor(args: Record<TArgs, string[]>) {
    this.args = args;
  }

  get(argName: TArgs): string[] {
    return this.args[argName] || [];
  }

  getString(argName: TArgs): string | undefined {
    return this.get(argName).at(-1);
  }

  getBoolean(argName: TArgs): boolean {
    return this.getString(argName) === "true";
  }
}
