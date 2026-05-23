export type {};

declare global {
  var __REDUX_DEVTOOLS_CONNECTIONS__: Record<
    string,
    ReturnType<NonNullable<Window["__REDUX_DEVTOOLS_EXTENSION__"]>["connect"]>
  >;
}
