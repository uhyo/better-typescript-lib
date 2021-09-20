/// <reference path="../generated/lib.es2017.d.ts" />

import { expectType } from "tsd";

{
  const obj1 = { foo: 123 };
  const values1 = Object.values(obj1);
  const entries1 = Object.entries(obj1);
  expectType<unknown[]>(values1);
  expectType<[string, unknown][]>(entries1);

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
}
function test<T>(obj: T) {
  const values = Object.values(obj);
  expectType<unknown>(values[0]);

  const entries = Object.entries(obj);
  expectType<string>(entries[0][0]);
  const v: unknown = entries[0][1];
}
