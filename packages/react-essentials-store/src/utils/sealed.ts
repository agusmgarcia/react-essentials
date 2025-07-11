import { properties } from "@agusmgarcia/react-essentials-utils";

export default function sealed(
  originalMethod: any,
  context:
    | ClassMethodDecoratorContext
    | ClassGetterDecoratorContext
    | ClassSetterDecoratorContext,
) {
  context.addInitializer(function (this) {
    if (!properties.has(this, "constructor", "function")) return;

    Object.defineProperty(this.constructor.prototype, context.name, {
      configurable: false,
      value: originalMethod,
      writable: false,
    });
  });

  return originalMethod;
}
