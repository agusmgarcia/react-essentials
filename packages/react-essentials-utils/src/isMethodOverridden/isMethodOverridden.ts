/**
 * Determines if a method has been overridden in a class hierarchy.
 *
 * @param instance - The object instance to check for method overrides
 * @param basePrototype - The base prototype to stop the search at
 * @param method - The name of the method to check
 * @returns The prototype object where the method is overridden, or undefined if the method is not overridden
 */
export default function isMethodOverridden(
  instance: object,
  basePrototype: object,
  method: string,
): object | undefined {
  let prototype = Object.getPrototypeOf(instance);

  let prototypeFirstImplementation: object | undefined = undefined;
  let prototypeLastImplementation: object | undefined = undefined;

  while (prototype !== null && prototype !== basePrototype) {
    if (Object.getOwnPropertyNames(prototype).includes(method)) {
      prototypeFirstImplementation = prototype;
      prototypeLastImplementation ||= prototype;
    }

    prototype = Object.getPrototypeOf(prototype);
  }

  if (
    !prototypeFirstImplementation ||
    prototypeFirstImplementation === prototypeLastImplementation
  )
    return undefined;

  return prototypeLastImplementation;
}
