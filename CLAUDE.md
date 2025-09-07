# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This project generates alternative TypeScript standard library definitions with improved type safety. The architecture consists of:

- **`build/`** - TypeScript build system and generation logic

  - `lib.ts` - Main script for generating improved lib definitions
  - `package.ts` - Script for building npm packages
  - `diff.ts` - Script for generating documentation diffs
  - `logic/` - Core generation logic and AST manipulation

- **`lib/`** - Source TypeScript lib definition improvements (what gets applied to TypeScript's built-in libs)

- **`generated/`** - Output directory for processed TypeScript lib files

- **`dist-package/`** - Individual npm packages for each TypeScript lib (e.g., es2015, dom, etc.)

- **`TypeScript/`** - Git submodule containing the official TypeScript repository for source lib files

  - Note: `TypeScript/lib/lib.dom.d.ts` and `TypeScript/lib/lib.es5.d.ts` are HUGE. Never try to read the whole file at once. Always grep for specific parts.

- **`tests/`** - Type-level tests using `tsd` to verify the improved type definitions work correctly

## Essential Commands

### Build Commands

```bash
# Compile TypeScript build scripts
npm run build:tsc

# Generate improved lib files from TypeScript source + better-typescript-lib improvements
npm run build:lib

# Build npm packages for distribution
npm run build:package

# Generate documentation diffs
npm run build:diff
```

### Testing

NOTE that you should run `npm run build:lib` and then `npm run build:package` before running tests to ensure the latest changes are reflected.

```bash
# Run type-level tests in tests/ directory
cd tests && npm test

# Or run tsd directly
cd tests && npx tsd
```

### Development Workflow

1. Modify type definitions in `lib/` directory
2. Run `npm run build:lib && npm run build:generate` to regenerate the output
3. Test changes with `cd tests && npm test`

NOTE that the generated type definitions only take effect during the tests. When you want to debug the generated types, the only way is to write a test case in the `tests/` directory and run `npm test` to see how the types behave. Do not forget to run `npm run build:lib && npm run build:generate` after modifying the source definitions in `lib/`.

## Key Implementation Details

- Uses AST manipulation to apply improvements to TypeScript's standard library definitions
- Generates separate npm packages that TypeScript automatically detects and uses (via `@typescript/lib-*` naming)
- The `ReplacementMap` system tracks which parts of the original TypeScript libs should be replaced with improved versions
- Type improvements focus on replacing `any` with more specific types like `JSONData` for `JSON.parse()`
- All changes prioritize type safety over convenience, potentially causing breaking changes in existing codebases

## Important Files

- `build/logic/generate.ts` - Core generation algorithm
- `build/logic/ReplacementMap.ts` - Tracks lib modifications
- `lib/es5.d.ts` - Main improvements to core JavaScript APIs
- `tests/src/` - Type-level tests for verifications
