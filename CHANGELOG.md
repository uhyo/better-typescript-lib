# Changelog

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
