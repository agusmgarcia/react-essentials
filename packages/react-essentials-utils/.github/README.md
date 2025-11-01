# React Essentials Utils

A set of functions and types that can be used in the consumer projects.

## Aggregate response

```typescript
const result = await aggregateResponse(
  (pageIndex, pageSize) =>
    fetch(`/api?page=${pageIndex}&limit=${pageSize}`).then((result) =>
      result.json(),
    ),
  10,
);
```

## Async func

```typescript
import { type AsyncFunc } from "@agusmgarcia/react-essentials-utils";

type Func1 = AsyncFunc; // => () => Promise<void>
type Func2 = AsyncFunc<number>; // => () => Promise<number>
type Func3 = AsyncFunc<number, [arg0: string]>; // => (arg0: string) => Promise<number>
```

## Cache

```typescript
import { Cache } from "@agusmgarcia/react-essentials-utils";

const cache = new Cache();
cache
  .getOrCreate("key", () => {
    // Run some exclusive function.
  })
  .then((result) => console.log(result));
```

## Children

```tsx
import { children } from "@agusmgarcia/react-essentials-utils";

const MyComponent = () => (
  <div>
    <input />
  </div>
);

const inputChildren = children.getOfType(input, MyComponent); // => React.ReactElement<InputProps, input>[]

const children = children.mapOfType(input, MyComponent, (child) => (
  <p>input replaced</p>
)); // => <div><p>input replaced</p></div>

const isMyComponent = children.isOfType(MyComponent, <MyComponent />); // => true;
```

## Dates

```typescript
import { dates } from "@agusmgarcia/react-essentials-utils";

dates.addDays("1995-06-17", 1); // => "1995-06-18"
dates.addMonths("1995-06-17", 1); // => "1995-07-17"
dates.addYears("1995-06-17", 1); // => "1996-06-17"
dates.clamp("1995-06-17", "1995-06-12", "1995-06-18"); // => "1995-06-17"
dates.differenceInDays("1995-06-17", "1995-05-30"); // => 18
dates.getCurrentDate(); // => the current date considering the timeZone
dates.getDate("1995-06-17"); // => 17
dates.getDayOfTheWeek("1995-06-17"); // => 6
dates.getFirstDateOfMonth("1995-06-17"); // => "1995-06-01"
dates.getLastDateOfMonth("1995-06-17"); // => "1995-06-30"
dates.getMonth("1995-06-17"); // => 6
dates.getYear("1995-06-17"); // => 1995
dates.max("1995-06-17", "1995-06-18", "1995-06-12"); // => "1995-06-18"
dates.min("1995-06-17", "1995-06-18", "1995-06-12"); // => "1995-06-12"
dates.toDateString("1995-06-17", "en-US", { day: "2-digit" }); // => "17"
dates.toString(new Date(1995, 5, 17)); // => "1995-06-17"
dates.validate("1995-06-17"); // => true
```

## Delay

```typescript
import { delay } from "@agusmgarcia/react-essentials-utils";

delay(2000).then(() => console.log("Done"));
```

## Empty function

```typescript
import { emptyFunction } from "@agusmgarcia/react-essentials-utils";

const function = emptyFunction;
```

## Equals

```typescript
import { equals } from "@agusmgarcia/react-essentials-utils";

equals.strict(1, 1); // => true
equals.shallow({ name: "john" }, { name: "john" }); // => true
equals.deep(
  { name: "john", address: { street: "doe" } },
  { name: "john", address: { street: "doe" } },
); // => true
```

## Errors

```typescript
import { errors } from "@agusmgarcia/react-essentials-utils";

errors.handle(
  () => {
    throw new Error();
  },
  (error) => {
    // Proper error handling
  },
);

errors.getMessage(new Error("My message")); // => "My message"

const result = input.startsWith("a")
  ? true
  : errors.emit("Input should start with 'a'");
```

## Files

```typescript
import { files } from "@agusmgarcia/react-essentials-utils";

files.isFile("src/index.json"); // => true if the path belongs to a file or throw error if it doesn't exist
files.readFile("src/index.json"); // => a string representing the content of the file
files.readRequiredFile("src/index.json"); // => a string representing the content of the file or throw error if it doesn't exist
files.removeFile("src/index.json"); // => remove the file
files.upsertFile("src/index.json", JSON.stringify({})); // => create or update the file
```

## Filters

```typescript
import { filters } from "@agusmgarcia/react-essentials-utils";

const array = [17, 6, 95, 6];

array.filter(filters.distinct); // => [17, 6, 95]
array.filter(filters.paginate(1, 2)); // => [17, 6]
```

## Finds

```typescript
import { finds } from "@agusmgarcia/react-essentials-utils";

const array = [17, 6, 95];

array.find(finds.first); // => 17
array.find(finds.single); // => throws error
array.find(finds.singleOrDefault); // => undefined
```

## Folders

```typescript
import { folders } from "@agusmgarcia/react-essentials-utils";

folders.readFolder("src"); // => a list of files
folders.removeFolder("src"); // => delete a folder
folders.removeFolderIfEmpty("src"); // => delete a folder if empty
folders.upsertFolder("src"); // => create a folder if it doesn't exist
```

## Func

```typescript
import { type Func } from "@agusmgarcia/react-essentials-utils";

type Func1 = Func; // => () => void
type Func2 = Func<number>; // => () => number
type Func3 = Func<number, [arg0: string]>; // => (arg0: string) => number
```

## Is SSR

```typescript
import { isSSR } from "@agusmgarcia/react-essentials-utils";

isSSR(); // => 'true' if server side and 'false' for client
```

## Merges

```tsx
import { merges } from "@agusmgarcia/react-essentials-utils";

merges.shallow({ name: "John" }, { surname: "Doe" }); // => { name: "John", surname: "Doe" }
merges.deep(
  [{ name: "John" }, { name: "Foo" }],
  [{ surname: "Doe" }, { surname: "Bar" }],
); // => [{ name: "John", surname: "Doe" }, { name: "Foo", surname: "Bar" }];
```

## Properties

```typescript
import { properties } from "@agusmgarcia/react-essentials-utils";

properties.has({ foo: 123 }, "foo"); // => true
properties.sort({ b: 2, a: { y: 2, x: 1 }, c: 3 }, [
  "a",
  "a.x",
  "a.y",
  "b",
  "c",
]); // => { a: { x: 1, y: 2 }, b: 2, c: 3 }
```

## Strings

```typescript
import { strings } from "@agusmgarcia/react-essentials-utils";

strings.capitalize("foo"); // => "Foo"
strings.uncapitalize("Foo"); // => "foo"
strings.replace("This is the ${value} test", { value: "third" }); // => "This is the third test"
strings.replace("${nights} ${nights?night:nights}", { nights: 1 }); // => "1 night"
strings.replace("${nights} ${nights?night:nights}", { nights: 2 }); // => "2 nights"
```

## Sorts

```typescript
import { sorts } from "@agusmgarcia/react-essentials-utils";

[1, 2].sort(sorts.byNumberAsc); // => [1, 2]
[1, 2].sort(sorts.byNumberDesc); // => [2, 1]
["john", "doe"].sort(sorts.byStringAsc); // => ["doe", "john"]
["john", "doe"].sort(sorts.byStringDesc); // => ["john", "doe"]
[false, true].sort(sorts.byBooleanAsc); // => [true, false]
[false, true].sort(sorts.byBooleanDesc); // => [false, true]
```

## Storage cache

```typescript
import { StorageCache } from "@agusmgarcia/react-essentials-utils";

const cache = new StorageCache("myCache", "session");
cache
  .getOrCreate("key", () => {
    // Run some exclusive function.
  })
  .then((result) => console.log(result));
```

## Tuple

```typescript
import { type Tuple } from "@agusmgarcia/react-essentials-utils";

type TupleOfThreeStrings = Tuple<string, 3>; // => [string, string, string]
```

## Use device pixel ratio

```typescript
import { useDevicePixelRatio } from "@agusmgarcia/react-essentials-utils";

function useHook() {
  const devicePixelRatio = useDevicePixelRatio(); // => window.devicePixelRatio
}
```

## Use dimensions

```typescript
import { useDimensions } from "@agusmgarcia/react-essentials-utils";

function useHook() {
  const ref = useRef<HTMLElement>(null);
  const dimensions = useDimensions(ref); // => The width and height of the element.
}
```

## Use element at bottom

```typescript
import { useElementAtBottom } from "@agusmgarcia/react-essentials-utils";
import { useRef } from "react";

function useHook() {
  const ref = useRef<HTMLElement>(null);
  const atBottom = useElementAtBottom(ref); // => true if the element has been scrolled at bottom
}
```

## Use element at top

```typescript
import { useElementAtTop } from "@agusmgarcia/react-essentials-utils";
import { useRef } from "react";

function useHook() {
  const ref = useRef<HTMLElement>(null);
  const atTop = useElementAtTop(ref); // => true if the element has been scrolled at top
}
```

## Use media query

```typescript
import { useMediaQuery } from "@agusmgarcia/react-essentials-utils";

function useHook() {
  const isTablet = useMediaQuery("(max-width: 767.98px)"); // => boolean
}
```
