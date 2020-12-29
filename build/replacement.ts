export const replacement = new Set<string>([
  // lib.es5.d.ts
  "eval",
  "ObjectConstructor",
  "CallableFunction",
  "IArguments",
  "JSON",
  "ArrayConstructor",
  // lib.es2015.collection.d.ts
  "Map",
  "MapConstructor",
  "WeakMap",
  "WeakMapConstructor",
  "ReadonlyMap",
  "Set",
  "SetConstructor",
  "ReadonlySet",
]);

export const betterLibs = new Set<string>([
  "lib.es5.d.ts",
  "lib.es2015.collection.d.ts",
]);
