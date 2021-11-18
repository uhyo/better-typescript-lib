import { expectType } from "tsd";

expectType<unknown>(Reflect.apply(() => {}, {}, []));
expectType<object>(Reflect.construct(function () {}, []));
{
  const obj1 = {
    foo: 123,
    bar: "wow",
  };
  expectType<number>(Reflect.get(obj1, "foo"));
  expectType<string>(Reflect.get(obj1, "bar"));
  expectType<unknown>(Reflect.get(obj1, 123));
}
