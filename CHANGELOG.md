# Changelog

## Unreleased

- fix: correct return type of `document.getElementById` from `HTMLElement | null` to `Element | null` to account for more general situations like `SVGElement`

## v2.10.1

- fix: more generic types for `Promise.then` and `Promise.catch` (https://github.com/uhyo/better-typescript-lib/pull/60)
- fix: allow to pass function or nullish to JSON.stringify (https://github.com/uhyo/better-typescript-lib/pull/61)

## v2.10.0

- Upgraded TypeScript to `5.7.2`. (https://github.com/uhyo/better-typescript-lib/pull/54)

## v2.9.0

- Upgraded TypeScript to `5.6.2`. (https://github.com/uhyo/better-typescript-lib/pull/51)

## v2.8.0

- Upgraded TypeScript to `5.5.3`. (https://github.com/uhyo/better-typescript-lib/pull/45)
- fix: tighten up Object.values and Object.entries types (https://github.com/uhyo/better-typescript-lib/pull/42)
- fix: improve NodeListOf<T>#item return type to include null (https://github.com/uhyo/better-typescript-lib/pull/44)

## v2.7.0

- Upgraded TypeScript to `5.4.3`. (https://github.com/uhyo/better-typescript-lib/pull/39)
- Improved `structuredClone` typing. (https://github.com/uhyo/better-typescript-lib/pull/38)

## v2.6.0

- Upgraded TypeScript to `5.3.3`.
- Fix poor type definition of `Array.prototype.map` for classes that extend `Array` (https://github.com/uhyo/better-typescript-lib/issues/35)

## v2.5.0

- Upgraded TypeScript to `5.2.2`.

## v2.4.0

- Upgraded TypeScript to `5.1.3`.

## v2.3.1

- Fix type errors when including `dom.iterable` lib to the project (https://github.com/uhyo/better-typescript-lib/issues/30)

## v2.3.0

This version newly includes improvements for DOM types (`fetch`). Thank you @aaditmshah!

- Upgraded TypeScript to `5.0.4`.
- Add strong types for `JSON.parse` and `JSON.stringify` (https://github.com/uhyo/better-typescript-lib/issues/25)
- Add strong type definition for `fetch().json()` (https://github.com/uhyo/better-typescript-lib/issues/26)
- Add better type definitions for promises (https://github.com/uhyo/better-typescript-lib/issues/28)

## v2.2.1

- Removed `CheckNonNullable` as it is no longer needed (https://github.com/uhyo/better-typescript-lib/pull/19)
- Added `/// <reference no-default-lib="true"/>` to library files

## v2.2.0

- Upgraded TypeScript to `4.9.3`.
- Several Improvements (https://github.com/uhyo/better-typescript-lib/pull/10)
- Improved typing of TypedArrays. (https://github.com/uhyo/better-typescript-lib/pull/12)
- Improved `Function#bind` and several `Object` method typings. (https://github.com/uhyo/better-typescript-lib/pull/16)
- Improved `Object#hasOwnProperty` and `Object.hasOwn` typings. (https://github.com/uhyo/better-typescript-lib/issues/13)
- Removed type guards from `Number` static methods because they affected soundness. (https://github.com/uhyo/better-typescript-lib/issues/14)

## v2.1.0

- Upgraded TypeScript to `4.6.4`.
- Improved typing of `Object.property.hasOwnProperty` and `Object.hasOwn`. (https://github.com/uhyo/better-typescript-lib/issues/4)
- Fixed typing of `JSON.stringify` so that its return type includes `undefined` when possible. (https://github.com/uhyo/better-typescript-lib/issues/6)
- Tightened typing of Array higher-order functions. Predicates passed to `filter`, `every` and `some` now must return a value of `boolean` type. (https://github.com/uhyo/better-typescript-lib/issues/7)

## v2.0.0

- Upgraded TypeScript to `4.5.2`.
- Installation steps were renewed. Support for TypeScript 4.4 and prior was dropped.
- Changed `JSON.stringify` type definitions and removed `ReadonlyJSONValue` type. (https://github.com/uhyo/better-typescript-lib/issues/5)

## v1.2.0

- Upgraded TypeScript to `4.4.3`.
- Improved `Object.values` and `Object.entries` type definitions. (https://github.com/uhyo/better-typescript-lib/pull/3)

## v1.1.0

- Upgraded TypeScript to `4.2.3`.

## v1.0.1

- Fixed type definiton of `JSON.stringify` so it accepts readonly arrays. (#1)
