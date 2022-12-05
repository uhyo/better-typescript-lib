import { expectError, expectType } from "tsd";

// ReadonlyArray
{
  // https://github.com/uhyo/better-typescript-lib/issues/7
  const a1: readonly number[] = [1, 2, 3];
  expectError(a1.find((x) => x));
  expectError(a1.findIndex((x) => x));
}

// Array
{
  // https://github.com/uhyo/better-typescript-lib/issues/7
  const a1: number[] = [1, 2, 3];
  expectError(a1.find((x) => x));
  expectError(a1.findIndex((x) => x));
}

// ObjectConstructor
{
  expectError(Object.assign(null));
  const obj1 = Object.assign({ foo: 123 });
  expectType<{ foo: number }>(obj1);
  const obj2 = Object.assign({ foo: 123 }, { bar: "wow" });
  expectType<{ foo: number } & { bar: string }>(obj2);
  const obj3 = Object.assign({ foo: 123 }, { bar: "wow" }, { baz: true });
  expectType<{ foo: number } & { bar: string } & { baz: boolean }>(obj3);
  const obj4 = Object.assign(
    { foo: 123 } as { foo: number } | { bar: string },
    { baz: true }
  );
  expectType<({ foo: number } | { bar: string }) & { baz: boolean }>(obj4);
  expectType<symbol[]>(Object.getOwnPropertySymbols([]));
  expectError(Object.getOwnPropertySymbols(null));
  const obj5 = Object.setPrototypeOf({ foo: 123 }, { bar: "wow" });
  expectType<{ foo: number } & { bar: string }>(obj5);
}
