import { expectError, expectType } from "tsd";

// ObjectConstructor
{
  // https://github.com/uhyo/better-typescript-lib/issues/4
  const obj: object = {};
  if (Object.hasOwn(obj, "foo")) {
    expectType<unknown>(obj.foo);
    expectType<object & { foo: unknown }>(obj);
  }
  const obj2 = { foo: 123 };
  if (Object.hasOwn(obj2, "bar")) {
    expectType<unknown>(obj2.bar);
    expectType<{ foo: number } & { bar: unknown }>(obj2);
  }
  const obj3 = () => {};
  if (Object.hasOwn(obj3, "baz")) {
    expectType<unknown>(obj3.baz);
    expectType<(() => void) & { baz: unknown }>(obj3);
  }

  const emptyObj = {};
  const key = Math.random() ? "foo" : "bar";
  if (Object.hasOwn(emptyObj, key)) {
    expectError(emptyObj.foo);
    expectError(emptyObj.bar);
    expectType<{ foo: unknown } | { bar: unknown }>(emptyObj);
  }
  const key2: string = "123";
  if (Object.hasOwn(emptyObj, key2)) {
    expectType<{}>(emptyObj);
  }
}

// https://github.com/uhyo/better-typescript-lib/issues/13
{
  const protoObj = { protoProp: "protoProp" };

  const obj: Record<string, string> = Object.create(protoObj);
  obj.ownProp = "ownProp";

  for (const key in obj) {
    if (!Object.hasOwn(obj, key)) continue;
    expectType<Record<string, string>>(obj);
    obj[key];
  }
}
