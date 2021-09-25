# better-typescript-lib

An alternative TypeScript standard library with better type definitions.

## The Problem

While it is well known that TypeScript is not _very_ type safe due to the existence of `any` and other pitfalls, TypeScript's built-in type definitions are also to blame for that unsafety. For example, it is handy but very unsafe that the return type of `JSON.parse` is `any`.

The core type checker of TypeScript has been improved to be more type safe, maintaining backwards compatibility through compiler options. Unfortunately, however, the type definitions are still not very good, and are harder to improve keeping backwards compatibility.

## The Solution

This package provides an alternative set of type definitions which replaces, and is safer than TypeScript's built-in ones. With this package, TypeScript users obtain less chance of unexpectedly getting `any` values. For example, in this type definition the return type of `JSON.parse` is not `any`, but `JSONData` which represents all possible JSON data.

This package also includes other improved, stricter type definitions.

## Installation

You only need to install `better-typescript-lib`. Additional configuration is not needed; your TypeScript project automatically use `better-typescript-lib` definitions.

Currently v2 is alpha-released.

```sh
npm i -D better-typescript-lib@2.0.0-alpha.1
```

### How it works

Starting from TypeScript 4.5, the TypeScript compiler detects existence of `@typescript/xxx` packages (e.g. `@typescript/es2015`) and uses them instead of the built-in definitions. By installing `better-typescript-lib`, these package names are mapped to corresponding `@better-typescript-lib/xxx` packages.

## Supported TypeScript Versions

| better-typescript-lib | TypeScript      |
| --------------------- | --------------- |
| 2.0.0                 | TS 4.5 or later |

For TS 4.4 and lower, see `v1` branch.

## Concepts

Better-typescript-lib is _not_ meant to be compatible with TypeScript's built-in library. Therefore it is the most suitable to new TypeScript projects. An existing project may also adopt better-typescript-lib but additional type errors need to be fixed.

As this is only an alternative to TypeScript's built-in type definitions, we have no plan of providing any runtime implemention through better-typescript-lib.

### Versioning Policy

Improvements to type definitions may be released as a new minor version even if it may cause new type errors to existing codebases.

## Contributing

Welcome

## License

This work is based on [TypeScript](https://github.com/microsoft/TypeScript)'s standard library created by Microsoft Corporation. We modify it as programmed in this repository and redistribute it under Apache 2.0 License.
