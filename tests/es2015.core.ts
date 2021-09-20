/// <reference path="../generated/lib.es2015.d.ts" />

import { expectType } from "tsd";

// NumberConstructor
{
  const n: unknown = "123";

  if (Number.isFinite(n)) {
    expectType<number>(n);
  }
  if (Number.isInteger(n)) {
    expectType<number>(n);
  }
  if (Number.isNaN(n)) {
    expectType<number>(n);
  }
  if (Number.isSafeInteger(n)) {
    expectType<number>(n);
  }
}
// ObjectConstructor
{
  const obj1 = Object.assign({ foo: 123 });
  expectType<{ foo: number }>(obj1);
  const obj2 = Object.assign({ foo: 123 }, { bar: "wow" });
  expectType<{ foo: number } & { bar: string }>(obj2);
  const obj3 = Object.assign({ foo: 123 }, { bar: "wow" }, { baz: true });
  expectType<{ foo: number } & { bar: string } & { baz: boolean }>(obj3);
}

export {};
