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
    { baz: true },
  );
  expectType<({ foo: number } | { bar: string }) & { baz: boolean }>(obj4);
  expectType<symbol[]>(Object.getOwnPropertySymbols([]));
  expectError(Object.getOwnPropertySymbols(null));
  const obj5 = Object.setPrototypeOf({ foo: 123 }, { bar: "wow" });
  expectType<{ foo: number } & { bar: string }>(obj5);

  // https://github.com/uhyo/better-typescript-lib/issues/71
  // Object.assign should preserve function callability
  const func1 = () => 42;
  const funcWithProps = Object.assign(func1, { baz: "hello" });
  expectType<(() => number) & { baz: string }>(funcWithProps);
  expectType<number>(funcWithProps()); // Should be callable
  expectType<string>(funcWithProps.baz); // Should have the added property

  const func2 = function(x: number): string { return x.toString(); };
  const funcWithProps2 = Object.assign(func2, { value: 123 }, { flag: true });
  expectType<((x: number) => string) & { value: number } & { flag: boolean }>(funcWithProps2);
  expectType<string>(funcWithProps2(42)); // Should be callable
  expectType<number>(funcWithProps2.value); // Should have added properties
  expectType<boolean>(funcWithProps2.flag);
}
