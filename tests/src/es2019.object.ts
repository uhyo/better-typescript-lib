import { expectType } from "tsd";

// ObjectConstructor
{
  const arr1: [] = [];
  const obj1 = Object.fromEntries(arr1);
  expectType<{}>(obj1);

  const arr2 = [
    ["foo", 123],
    ["bar", 456],
  ] as const;
  const obj2 = Object.fromEntries(arr2);
  expectType<{
    foo: 123 | 456;
    bar: 123 | 456;
  }>(obj2);

  const arr3: [string, number][] = [];
  const obj3 = Object.fromEntries(arr3);
  expectType<Record<string, number>>(obj3);
}
