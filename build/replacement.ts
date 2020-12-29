export const replacement = new Map([
  [
    "lib.es5.d.ts",
    new Set([
      "eval",
      "ObjectConstructor",
      "CallableFunction",
      "IArguments",
      "JSON",
      "ArrayConstructor",
    ]),
  ],
  [
    "lib.es2015.collection.d.ts",
    new Set([
      "Map",
      "MapConstructor",
      "WeakMap",
      "WeakMapConstructor",
      "ReadonlyMap",
      "Set",
      "SetConstructor",
      "ReadonlySet",
    ]),
  ],
  [
    "lib.es2015.core.d.ts",
    new Set(["NumberConstructor", "ObjectConstructor", "String"]),
  ],
  ["lib.es2015.generator.d.ts", new Set(["Generator"])],
  [
    "lib.es2015.iterable.d.ts",
    new Set([
      "Iterator",
      "IterableIterator",
      "IArguments",
      "PromiseConstructor",
    ]),
  ],
  ["lib.es2015.promise.d.ts", new Set(["PromiseConstructor"])],
]);
