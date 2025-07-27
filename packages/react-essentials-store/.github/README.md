# React Essentials Store

An opinionated state manager. It provides tools to create global and server states.

## Global slice

This is the state that is going to be consumed globally across the app. It is handled by the `GlobalSlice` class. It can be **read and written**.

```ts
// ./src/store/FormSearchSlice.ts

import { GlobalSlice } from "@agusmgarcia/react-essentials-store";
import { type Func } from "@agusmgarcia/react-essentials-utils";

export type FormSearch = {
  asc: boolean;
  clear: Func;
  name: string;
};

export default class FormSearchSlice extends GlobalSlice<FormSearch> {
  constructor() {
    super({ asc: false, name: "" });
  }

  clear(): void {
    this.state = { asc: false, name: "" };
  }

  setAsc(asc: boolean): void {
    this.state = { ...this.state, asc };
  }

  setName(name: string): void {
    this.state = { ...this.state, name };
  }
}
```

## Server slice

The state that is populated from an API or an external resource. It is handled by the `ServerSlice` class. Due the way it gets originated, it can be **read** only.

```ts
// ./src/store/FormResultSlice.ts

import { ServerSlice } from "@agusmgarcia/react-essentials-store";
import { type Func } from "@agusmgarcia/react-essentials-utils";

import type FormSearchSlice from "./FormSearchSlice";
import { type FormSearch } from "./FormSearchSlice";

export type FormResult = {
  age: number;
  name: string;
  surname: string;
}[];

export type Request = {
  asc: boolean;
  name: string;
};

export default class FormResultSlice extends ServerSlice<
  FormResult,
  Request,
  { formSearch: FormSearchSlice }
> {
  constructor() {
    super();
  }

  protected override onBuildRequest(): Request {
    return {
      asc: this.slices.formSearch.state.asc,
      name: this.slices.formSearch.state.name,
    };
  }

  protected override onFetch(
    request: Request,
    signal: AbortSignal,
  ): FormResult {
    return fetch(`/api/search?asc=${request.asc}&name=${request.name}`, {
      signal,
    }).then((result) => result.json());
  }
}
```

## Store

The slices are gathered into a store object. It is handled by `createStore` function. The slices are passed as arguments. Then, they can be accessed thru the `useSelector` hook. You can create custom hooks that access the different pieces of each slice as described in the example below:

```typescript
// ./src/store/index.ts

import { createReactStore } from "@agusmgarcia/react-essentials-store";

import FormSearchSlice from "./FormSearchSlice";
import FormResultSlice from "./FormResultSlice";

const { useSelector, ...reactStore } = createReactStore({
  slices: {
    formSearch: FormSearchSlice,
    formResult: FormResultSlice,
  },
});

export const StoreProvider = reactStore.StoreProvider;

export function useFormSearch() {
  return {
    clearFormSearch: useSelector((state) => state.formSearch.clear),
    formSearchAsc: useSelector((state) => state.formSearch.state.asc),
    formSearchName: useSelector((state) => state.formSearch.state.name),
    setFormSearchAsc: useSelector((state) => state.formSearch.setAsc),
    setFormSearchName: useSelector((state) => state.formSearch.setName),
  };
}

export function useFormResult() {
  return {
    formResult: useSelector((state) => state.formResult.response),
    formResultError: useSelector((state) => state.formResult.state.error),
    formResultLoading: useSelector((state) => state.formResult.state.loading),
    formResultReload: useSelector((state) => state.formResult.reload),
  };
}
```

> Make sure to export the `StoreProvider` component as it is going to be used in the entry point of the app.

### Wrap the main component with the created StoreProvider component

```tsx
// ./pages/_app.tsx

import "./_app.css";

import { type AppProps } from "next/app";
import Head from "next/head";

import { StoreProvider } from "#src/store";

export default function App({ Component, pageProps }: AppProps<any>) {
  return (
    <>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </>
  );
}
```
