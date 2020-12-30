# better-typescript-lib

An alternative TypeScript standard library with better type definitions.

## The Problem

While it is well known that TypeScript is not _very_ type safe due to the existence of `any` and other pitfalls, TypeScript's built-in type definitions are also to blame for that unsafety. For example, it is handy but very unsafe that the return type of `JSON.parse` is `any`.

Ideally TypeScript's built-in type definitions should have been better in view of type safety, but it is nearly impossible if we take backward compatibility into account.

## The Solution

This package provides an alternative type definitions which are safer than TypeScript's built-in ones. With this package, TypeScript users obtain less chance of unexpectedly getting `any` values. This package also includes other improved, stricter type definitions.

## Usage

### Install

```sh
npm i -D better-typescript-lib
```

### Remove built-in library from tsconfig.json

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

## Contributing

Welcome
