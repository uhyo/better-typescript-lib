import { expectType } from "tsd";

function createGenericRecord<K extends string, V>(
  keys: K[],
  values: V[]
): Record<K, V> {
  return Object.fromEntries(keys.map((k, i) => [k, values[i]!] as const));
}

{
  const obj1: { [k: string]: number } = { foo: 123 };
  const values1 = Object.values(obj1);
  const entries1 = Object.entries(obj1);
  expectType<number[]>(values1);
  expectType<[string, number][]>(entries1);

  const obj2: Record<string, number> = {};
  const values2 = Object.values(obj2);
  const entries2 = Object.entries(obj2);
  expectType<number[]>(values2);
  expectType<[string, number][]>(entries2);

  const obj3 = ["foo", "bar", "baz"];
  const values3 = Object.values(obj3);
  const entries3 = Object.entries(obj3);
  expectType<string[]>(values3);
  expectType<[string, string][]>(entries3);

  const obj4 = createGenericRecord(["foo", "bar", "baz"], [1, 2, 3]);
  const values4 = Object.values(obj4);
  const entries4 = Object.entries(obj4);
  expectType<number[]>(values4);
  expectType<(["foo", number] | ["bar", number] | ["baz", number])[]>(entries4);

  const obj5 = { foo: 1, bar: obj1, baz: 3 };
  const values5 = Object.values(obj5);
  const entries5 = Object.entries(obj5);
  expectType<(number | { [k: string]: number })[]>(values5);
  expectType<
    (["foo", number] | ["baz", number] | ["bar", { [k: string]: number }])[]
  >(entries5);
}
function test<T>(obj: T) {
  const values = Object.values(obj);
  expectType<unknown>(values[0]);

  const entries = Object.entries(obj);
  expectType<string>(entries[0][0]);
  const v: unknown = entries[0][1];
}
