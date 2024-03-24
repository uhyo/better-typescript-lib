import { expectType } from "tsd";

class A {}

expectType<void>(Reflect.apply(() => {}, {}, []));
// @ts-expect-error
expectType<number>(Reflect.apply((foo: number) => 3, {}, []));
expectType<number>(Reflect.apply((foo: number) => 3, {}, [123]));
expectType<A>(Reflect.construct(A, []));
{
  const obj1 = {
    foo: 123,
    bar: "wow",
  };
  expectType<number>(Reflect.get(obj1, "foo"));
  expectType<string>(Reflect.get(obj1, "bar"));
  expectType<unknown>(Reflect.get(obj1, 123));
}
