/// <reference path="../dist/lib/lib.es5.d.ts" />

import { expectType } from "tsd";

// eval
expectType<unknown>(eval("foo"));
// Object
expectType<{}>(Object());
expectType<{ foo: number }>(Object({ foo: 123 }));
expectType<{}>(Object(123));
// $ExpctType unknown
expectType<unknown>(Object.getPrototypeOf([]));
// Object.create
expectType<{}>(Object.create(null));
// $ExpectType { foo: number; bar: string }
expectType<{ foo: number; bar: string }>(
  Object.create(null, {
    foo: {
      value: 123,
    },
    bar: {
      get() {
        return "hi";
      },
    },
  })
);

// Object.defineProperty
expectType<{ foo: number }>(
  Object.defineProperty({}, "foo", {
    value: 123,
  })
);
expectType<{ foo: number } | { bar: number }>(
  Object.defineProperty({}, "foo" as "foo" | "bar", {
    value: 123,
  })
);

expectType<{ foo: number; bar: string; baz: boolean }>(
  Object.defineProperties(
    { foo: 123 },
    {
      bar: {
        value: "hi",
      },
      baz: {
        get() {
          return true;
        },
      },
    }
  )
);

export {};
