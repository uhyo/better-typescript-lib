const aliasArray: [string, string[]][] = [
  [
    "TypedNumberArray",
    [
      "Int8Array",
      "Uint8Array",
      "Uint8ClampedArray",
      "Int16Array",
      "Uint16Array",
      "Int32Array",
      "Uint32Array",
      "Float32Array",
      "Float64Array",
    ],
  ],
  ["TypedBigIntArray", ["BigInt64Array", "BigUint64Array"]],
];

export const alias = new Map(
  aliasArray.flatMap(([originalType, replacementTypes]) => [
    [
      originalType,
      new Map(
        replacementTypes.map((replacement) => [
          replacement,
          new Map([
            [originalType, replacement],
            [`${originalType}Constructor`, `${replacement}Constructor`],
          ]),
        ])
      ),
    ],
    [
      `${originalType}Constructor`,
      new Map(
        replacementTypes.map((replacement) => [
          `${replacement}Constructor`,
          new Map([
            [originalType, replacement],
            [`${originalType}Constructor`, `${replacement}Constructor`],
          ]),
        ])
      ),
    ],
  ])
);
