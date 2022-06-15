import { expectError } from "tsd";
// TypedNumberArray
{
  for (const TypedBigIntArray of [BigInt64Array, BigUint64Array]) {
    const a1 = new TypedBigIntArray();
    expectError(a1.filter((x) => x));
    expectError(a1.every((x) => x));
    expectError(a1.some((x) => x));
    expectError(a1.find((x) => x));
    expectError(a1.findIndex((x) => x));
  }
}
