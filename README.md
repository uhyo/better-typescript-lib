# better-typescript-lib

An alternative TypeScript standard library with better type definitions.

## The Problem

While it is well known that TypeScript is not _very_ type safe due to the existence of `any` and other pitfalls, TypeScript's built-in type definitions are also to blame for that unsafety. For example, it is handy but very unsafe that the return type of `JSON.parse` is `any`.

The core type checker of TypeScript has been improved to be more type safe, maintaining backwards compatibility through compiler options. Unfortunately, however, the type definitions are still not very good, and are harder to improve keeping backwards compatibility.

## The Solution

This package provides an alternative set of type definitions which replaces, and is safer than TypeScript's built-in ones. With this package, TypeScript users obtain less chance of unexpectedly getting `any` values. For example, in this type definition the return type of `JSON.parse` is not `any`, but `JSONData` which represents all possible JSON data.

This package also includes other improved, stricter type definitions.

## Usage

### Install

```sh
npm i -D better-typescript-lib
```

### Disable built-in library from tsconfig.json

```diff
- "lib": ["es5", "dom"]
+ "noLib": true
```

### Include better-typescript-lib

Include better-typescript-lib with triple-slash directives from the entry point of your code. Note that these directives must be placed at the very top of a `.ts` file.

```ts
/// <reference path="./node_modules/better-typescript-lib/lib.es5.d.ts" />
/// <reference path="./node_modules/better-typescript-lib/lib.dom.d.ts" />
```

## Supported TypeScript Versions

| better-typescript-lib | TypeScript      |
| --------------------- | --------------- |
| 1.2.0                 | TS 4.4 or later |
| 1.1.0                 | TS 4.2 or later |
| 1.0.0                 | TS 4.1 or later |

## Concepts

Better-typescript-lib is _not_ meant to be compatible with TypeScript's built-in library. Therefore it is the most suitable to new TypeScript projects. An existing project may also adopt better-typescript-lib but additional type errors need to be fixed.

As this is only an alternative to TypeScript's built-in type definitions, we have no plan of providing any runtime implemention through better-typescript-lib.

### Versioning Policy

Improvements to type definitions may be released as a new minor version even if it may cause new type errors to existing codebases.

## Contributing

Welcome

## License

This work is based on [TypeScript](https://github.com/microsoft/TypeScript)'s standard library created by Microsoft Corporation. We modify it as programmed in this repository and redistribute it under Apache 2.0 License.
