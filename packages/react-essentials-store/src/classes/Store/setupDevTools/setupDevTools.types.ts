export type {};

declare global {
  // eslint-disable-next-line project-structure/file-composition
  var __REDUX_DEVTOOLS_CONNECTIONS__: Record<
    string,
    ReturnType<NonNullable<Window["__REDUX_DEVTOOLS_EXTENSION__"]>["connect"]>
  >;
}
