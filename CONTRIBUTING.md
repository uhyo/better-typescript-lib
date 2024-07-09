# Contributing to better-typescript-lib

Thank you for considering contributing to this project. Here is the guideline on how to contribute.

You can just file an issue or send a pull request. Bug report, feature suggestion and other discussion are all welcome.

## Submitting an issue

### Bug Reports

When senging a bug report, please clarify the version of TypeScript you are using and the version of better-typescript-lib you are using.

### Feature Suggestions

Feature suggestions are welcome, but please be aware that:

- We consider type safety as the primary goal of this project. Therefore, unsafe-but-useful features are not accepted.

## Submitting a pull request

Below are the guidelines for submitting a pull request.

### How to change type definitions

better-typescript-lib replaces the built-in type definitions with its own ones. The renewed definitions are in the `lib/` directory.

For interfaces, replacement is done on per-field basis. As illustrated below, if our definition includes an `A` interface with a `field1` field, the original `field1` type of the `A` interface is replaced with our definition. Other fields are not affected and the original ones are kept.

```ts
// Original
interface A {
  field1: string;
  field2: number;
}

// Our lib/ definition
interface A {
  field1: SomeRefinedType;
}

// Result
interface A {
  field1: SomeRefinedType;
  field2: number;
}
```

For other declarations, such as type aliases, enums, and namespaces, the replacement is done on per-name basis. If our definition includes an `A` type alias, the entire declaration of `A` is replaced with ours.

### Committing Build Artifacts

Currently, build artifacts needs to be committed. Follow the following steps to build and commit them.

1. `npm run build:tsc`
2. `npm run build:lib`
3. `npm run build:diff`
4. Commit the build artifacts

### How to Run Tests

Follow below steps to run tests locally.

1. `npm run build:tsc`
2. `npm run build:lib`
3. `npm run build:package`
4. `npm run install` in tests directory
5. `npm test` in tests directory

## Upgrading TypeScript version

Below is the procedure to upgrade TypeScript version.

1. Update `typescript` dependency in `package.json` and `tests/package.json`
2. Update `tsd` dependency in `tests/package.json` to a version that supports the target TypeScript version
3. Update the git submodule in `TypeScript` directory (use the git tag of target version)
4. Build this library (see 'Commiting Build Artifacts' section)
5. Review the diff in `generated/lib.*.d.ts` files. This represents the diff of TypeScript library between the previous version and the target version. If any change is undesirable (e.g. contains a new `any`), implement a fix in `lib/` directory (maybe as a separate task).
6. Run tests with the new version, of course.
7. Done!
