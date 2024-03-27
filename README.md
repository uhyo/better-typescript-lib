# better-typescript-lib

An alternative TypeScript standard library with better type definitions.

## What is better-typescript-lib?

TypeScript's built-in type definitions are not _very_ type safe. For example, the return type of `JSON.parse` is `any`.

```ts
const obj = JSON.parse('{"foo": 42}');
//    ^? any

const foo: number = obj.fooo; // oops!
```

As you know, the `any` type breaks type safety and makes it far easier to introduce bugs.

If we consider type safety seriously, the return type of `JSON.parse` should be “any value that can be represented in JSON” and operations on such values should be limited until they are further inspected.

This is why better-typescript-lib uses `JSONData` as the return type of `JSON.parse`.

Almost all `any` usage in TypeScript's built-in type definitions is replaced with safer types in better-typescript-lib. Also, better-typescript-lib includes other improvements to the type definitions.

## Why better-typescript-lib?

Why don't we just fix TypeScript's built-in type definitions rather than maintaining a separate package? Actually, most of improvements in better-typescript-lib are unlikely to be accepted by TypeScript's maintainers if presented as possible improvement to TypeScript itself. This is because the improvements are too breaking to existing codebases.

A large part of `any` usage in TypeScript's built-in type definitions are there before the `unknown` type was introduced in TypeScript 3.0. Back then, there was no good way to represent “any value” in TypeScript's type system. Therefore, `any` was used as the best approximation. Aside from `any`, there are a lot of possible improvements that became possible as TypeScript evolved.

In other words, if you don't care about breaking changes (for example, you are starting a new project), you are just suffering from stale type definitions from the old days without getting any benefits from the maintained backward compatibility.

This is where better-typescript-lib comes in. It is a separate package that can be used in new projects or projects that are willing to fix type errors caused by the improvements.

[You can see the diff from the original TypeScript lib here](./docs/diff.md).

## Installation

You only need to install `better-typescript-lib`. For npm and yarn, additional configuration is not needed; your TypeScript project automatically starts to use `better-typescript-lib` definitions. For pnpm, see below.

```sh
npm i -D better-typescript-lib
```

[If you are using TypeScript 4.4 or prior, see the v1 branch.](https://github.com/uhyo/better-typescript-lib/tree/v1)

### How it works

Starting from TypeScript 4.5, the TypeScript compiler detects existence of `@typescript/lib-xxx` packages (e.g. `@typescript/lib-es2015`) and uses them instead of the built-in definitions. By installing `better-typescript-lib`, these package names are mapped to corresponding `@better-typescript-lib/xxx` packages.

### With pnpm

With pnpm, you need to append the following line to the `.npmrc` file:

```properties
public-hoist-pattern[]=@typescript/*
```

With pnpm the `@better-typescript-lib/xxx` packages are not installed to `node_modules/@typescript/xxx` without [`public-hoist-pattern`](https://pnpm.io/npmrc#public-hoist-pattern).

This is because, unlike npm and yarn, by default pnpm does not allow your source code to access dependencies that have not been added to your project as dependencies.

## Supported TypeScript Versions

| better-typescript-lib | TypeScript      |
| --------------------- | --------------- |
| 2.7.0                 | TS 5.4 or later |
| 2.6.0                 | TS 5.3 or later |
| 2.5.0                 | TS 5.2 or later |
| 2.4.0                 | TS 5.1 or later |
| 2.3.0                 | TS 5.0 or later |
| 2.2.0                 | TS 4.9 or later |
| 2.1.0                 | TS 4.6 or later |
| 2.0.0                 | TS 4.5 or later |

[If you are using TypeScript 4.4 or prior, see the v1 branch.](https://github.com/uhyo/better-typescript-lib/tree/v1)

## Goals and Non-Goals

Better-typescript-lib aims to provide better type definitions for TypeScript's standard library. _Better_ means more type safety, therefore they may cause more type errors to existing codebases.

While better type definitions are often more convenient to use, this is not always the case. If type safety and convenience are in conflict, better-typescript-lib prioritizes type safety.

As this is only an alternative to TypeScript's built-in type definitions, we have no plan of providing any runtime implementation through better-typescript-lib.

### Versioning Policy

Better-typescript-lib is based on TypeScript's standard library. Therefore, a new TypeScript version will be followed by a corresponding better-typescript-lib version. If you want to use a new feature included in a new TypeScript version, you need to use a better-typescript-lib version that supports that TypeScript version.

Improvements to type definitions may be released as a new minor version even if it may cause new type errors to existing codebases. We recommend regularly updating better-typescript-lib to the latest version and fixing type errors caused by the updates.

This is similar to how TypeScript itself evolves, but better-typescript-lib updates may have more breaking changes than TypeScript itself due to the nature of the improvements.

## Contributing

Welcome

## License

This work is based on [TypeScript](https://github.com/microsoft/TypeScript)'s standard library created by Microsoft Corporation. We modify it as programmed in this repository and redistribute it under Apache 2.0 License.
