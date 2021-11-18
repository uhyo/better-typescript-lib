import { expectError, expectType } from "tsd";

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

// CallableFunction
{
  const add = (a: number, b: number): number => a + b;
  expectType<(a: number, b: number) => number>(add.bind(null));
  expectType<(b: number) => number>(add.bind(null, 123));
  expectType<() => number>(add.bind(null, 123, 456));
  expectError(add.bind(null, 123, 456, 789));

  const add2 = function (this: { num: number }, a: number): number {
    return this.num + a;
  };
  expectError(add2.bind(null));
  expectError(add2.bind(null, 123));
  expectType<(a: number) => number>(add2.bind({ num: 0 }));
  expectType<() => number>(add2.bind({ num: 100 }, 123));
  expectError(add2.bind({ num: 100 }, 123, 456));
}

// IArguments
(function () {
  expectType<unknown>(arguments[0]);
})();

// JSON
{
  expectType<JSONValue>(JSON.parse("{}"));
  const arr = [1, 2, "foo"];
  expectType<string>(JSON.stringify(arr));
  const obj = { foo: { bar: 1 } };
  expectType<string>(JSON.stringify(obj));
  const readonlyArr = [1, 2, 3] as const;
  expectType<string>(JSON.stringify(readonlyArr));
  const readonlyObj = { foo: { bar: 1 } } as const;
  expectType<string>(JSON.stringify(readonlyObj));

  // https://github.com/uhyo/better-typescript-lib/issues/5
  interface Param {
    id: string;
    value: number;
  }
  +function foo(param: Param, readonlyParam: Readonly<Param>) {
    JSON.stringify(param); // error
    JSON.stringify(readonlyParam);
  };
}

// ArrayConstructor
{
  const a1 = new Array();
  expectType<unknown[]>(a1);
  const a2 = new Array<number>();
  expectType<number[]>(a2);
  const a3: number[] = new Array();
  expectType<number[]>(a3);
  const a4 = new Array("foo", "bar");
  expectType<string[]>(a4);

  const a5 = new Array(1);
  expectType<unknown[]>(a5);

  const a6 = new Array<boolean>(1);
  expectType<boolean[]>(a6);

  const a7: boolean[] = new Array(1);
  expectType<boolean[]>(a7);

  const a8: {} = {};
  if (Array.isArray(a7)) {
    expectType<boolean>(a7[0]);
  }
  if (Array.isArray(a8)) {
    expectType<unknown>(a8[0]);
  }
}

export {};
