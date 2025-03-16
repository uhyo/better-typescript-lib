export type AliasDetails = {
  /**
   * File to which this alias applies.
   */
  file: string;
  /**
   * Needed replacement.
   */
  replacement: Map<string, string>;
};

const es5TypedArrays = [
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Uint16Array",
  "Int32Array",
  "Uint32Array",
  "Float32Array",
  "Float64Array",
  "Float16Array",
];

const es2020TypedBigIntArrays = ["BigInt64Array", "BigUint64Array"];

export const alias = new Map([
  [
    "TypedNumberArray",
    es5TypedArrays.map((name) => ({
      file: "lib.es5.d.ts",
      replacement: new Map([["TypedNumberArray", name]]),
    })),
  ],
  [
    "TypedNumberArrayConstructor",
    es5TypedArrays.map((name) => ({
      file: "lib.es5.d.ts",
      replacement: new Map([
        ["TypedNumberArray", name],
        ["TypedNumberArrayConstructor", `${name}Constructor`],
      ]),
    })),
  ],
  [
    "TypedNumberArrayConstructorIter",
    es5TypedArrays.map((name) => ({
      file: "lib.es2015.iterable.d.ts",
      replacement: new Map([
        ["TypedNumberArray", name],
        ["TypedNumberArrayConstructorIter", `${name}Constructor`],
      ]),
    })),
  ],
  [
    "TypedBigIntArray",
    es2020TypedBigIntArrays.map((name) => ({
      file: "lib.es2020.bigint.d.ts",
      replacement: new Map([["TypedBigIntArray", name]]),
    })),
  ],
  [
    "TypedBigIntArrayConstructor",
    es2020TypedBigIntArrays.map((name) => ({
      file: "lib.es2020.bigint.d.ts",
      replacement: new Map([
        ["TypedBigIntArray", name],
        ["TypedBigIntArrayConstructor", `${name}Constructor`],
      ]),
    })),
  ],
]);
