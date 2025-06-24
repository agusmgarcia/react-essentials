export default function sortProperties<TElement>(
  input: TElement,
  preferred: string[] = [],
  base: string = "",
): TElement {
  const baseParts = base.split(".").filter((b) => !!b);

  const scopePreferred = preferred
    .map((p) => {
      const pParts = p.split(".");

      if (pParts.length <= baseParts.length) return p;

      for (let i = 0; i < baseParts.length; i++) {
        if (pParts[i] === "*") pParts[i] = baseParts[i];
        else if (pParts[i] !== baseParts[i]) return p;
      }

      return pParts.join(".");
    })
    .filter((p) => p.startsWith(base))
    .map((p) => p.replace(base, ""))
    .map((p) => p.split(".", 1)[0])
    .filter((p) => !!p);

  function sortKeys(key1: string, key2: string): number {
    const indexOfKey1 = scopePreferred.indexOf(key1);
    const indexOfKey2 = scopePreferred.indexOf(key2);

    if (indexOfKey1 === -1 && indexOfKey2 === -1)
      return +(key1 > key2) || -(key2 > key1);

    if (indexOfKey1 === -1) return 1;
    if (indexOfKey2 === -1) return -1;

    return indexOfKey1 - indexOfKey2;
  }

  let array = true;

  let arrayOfInput: Array<any>;

  if (!Array.isArray(input)) {
    array = false;
    arrayOfInput = [input];
  } else {
    arrayOfInput = input;
  }

  const result = arrayOfInput
    .map((i) => {
      if (typeof i !== "object" || !i) return i;
      return Object.keys(i)
        .sort(sortKeys)
        .reduce((result, key) => {
          (result as Record<string, any>)[key] = sortProperties(
            i[key as keyof typeof i],
            preferred,
            `${base}${key.replace(/\./g, "@@@@")}.`,
          );
          return result;
        }, {} as TElement);
    })
    .sort();

  if (array) return result as TElement;
  return result[0] as TElement;
}
