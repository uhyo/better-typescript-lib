import { expectError, expectType } from "tsd";

// eval
expectType<unknown>(eval("foo"));
// Object
expectType<{}>(Object());
expectType<{ foo: number }>(Object({ foo: 123 }));
expectType<{}>(Object(123));
// $ExpctType unknown
expectType<unknown>(Object.getPrototypeOf([]));
// Object.getOwnPropertyNames
expectType<never>(Object.getOwnPropertyNames(null));
// Object.create
expectType<{}>(Object.create(null));
expectType<{ foo: number }>(Object.create({ foo: 123 }));

const obj = {
  foo: {
    value: 123,
  },
  bar: {
    get() {
      return "hi";
    },
  },
};
const obj1 = { baz: true };
expectType<{ foo: number; bar: string }>(Object.create(null, obj));
expectType<{ foo: number; bar: string; baz: boolean }>(
  Object.create(obj1, obj)
);

// Object
{
  // https://github.com/uhyo/better-typescript-lib/issues/4
  const obj: object = {};
  if (obj.hasOwnProperty("foo")) {
    expectType<unknown>(obj.foo);
    expectType<{ foo: unknown }>(obj);
  }
  const obj2 = { foo: 123 };
  if (obj2.hasOwnProperty("bar")) {
    expectType<unknown>(obj2.bar);
    expectType<{ foo: number } & { bar: unknown }>(obj2);
  }
  const obj3 = () => {};
  if (obj3.hasOwnProperty("baz")) {
    expectType<unknown>(obj3.baz);
    expectType<(() => void) & { baz: unknown }>(obj3);
  }

  const emptyObj = {};
  const key = Math.random() ? "foo" : "bar";
  if (emptyObj.hasOwnProperty(key)) {
    expectError(emptyObj.foo);
    expectError(emptyObj.bar);
    expectType<{ foo: unknown } | { bar: unknown }>(emptyObj);
  }
  const key2: string = "123";
  if (emptyObj.hasOwnProperty(key2)) {
    expectType<{}>(emptyObj);
  }
}

// ObjectConstructor
{
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
}

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

// NewableFunction
{
  class Foo {
    constructor(private a: number, private b: number) {}
  }
  expectType<new (a: number, b: number) => Foo>(Foo.bind(null));
  expectType<new (b: number) => Foo>(Foo.bind(null, 123));
  expectType<new () => Foo>(Foo.bind(null, 123, 456));
  expectError(Foo.bind(null, 123, 456, 789));
}

// IArguments
(function () {
  expectType<unknown>(arguments[0]);
})();

// String
{
  "foobar".replace(/foo/g, (substr, p1, p2) => {
    // expectType<string>(substr);
    // expectType<string | number>(p1);
    // expectType<string | number>(p2);
    return "";
  });
}

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

  // https://github.com/uhyo/better-typescript-lib/issues/6
  expectType<undefined>(JSON.stringify(undefined));
  expectType<undefined>(JSON.stringify(() => {}));
  expectType<undefined>(JSON.stringify(class A {}));
  const unknown: unknown = 123;
  expectType<string | undefined>(JSON.stringify(unknown));
  const funcOrNum = Math.random() < 0.5 ? () => {} : 123;
  expectType<string | undefined>(JSON.stringify(funcOrNum));
  const empty = {};
  expectType<string | undefined>(JSON.stringify(empty));
  const o: object = () => {};
  expectType<string | undefined>(JSON.stringify(o));
}

let reduce!: "reduce" | "reduceRight";

// ReadonlyArray
{
  // https://github.com/uhyo/better-typescript-lib/issues/7
  const a1: readonly number[] = [1, 2, 3];
  expectError(a1.reverse());
  expectType<number>(a1.indexOf(1));
  expectType<number>(a1.lastIndexOf(1));

  expectType<number[]>(
    a1.filter((x, index) => {
      expectType<number>(x);
      expectType<number>(index);
      return x > 2;
    })
  );
  expectType<1[]>(
    a1.filter((x, index): x is 1 => {
      expectType<number>(x);
      expectType<number>(index);
      return x === 1;
    })
  );
  if (
    a1.every((x, index): x is 2 => {
      expectType<number>(x);
      expectType<number>(index);
      return x === 2;
    })
  ) {
    expectType<readonly 2[]>(a1);
  }

  a1.some((...[x, index]) => {
    expectType<number>(x);
    expectType<number>(index);
    return true;
  });
  a1.forEach((...[x, index]) => {
    expectType<number>(x);
    expectType<number>(index);
  });
  expectType<"bar"[]>(
    a1.map((...[x, index]) => {
      expectType<number>(x);
      expectType<number>(index);
      return "bar" as const;
    })
  );

  expectType<"bar">(
    a1[reduce]<"bar">((p, x, index) => {
      expectType<number | "bar">(p);
      expectType<number>(x);
      expectType<number>(index);
      return "bar";
    })
  );
  expectType<"bar">(
    a1[reduce]<"bar">((p, x, index) => {
      expectType<"bar">(p);
      expectType<number>(x);
      expectType<number>(index);
      return "bar";
    }, "bar")
  );

  expectError(a1.filter((x) => x));
  expectError(a1.every((x) => x));
  expectError(a1.some((x) => x));

  // Tuple
  const t1 = ["foo", 42, true] as const;
  expectError(t1.reverse());
  expectType<-1 | 0 | 1 | 2>(t1.indexOf(true));
  expectType<-1 | 0 | 1 | 2>(t1.lastIndexOf(true));

  // https://github.com/microsoft/TypeScript/issues/48663
  expectType<("foo" | 42 | true)[]>(
    t1.filter((...[x, index]) => {
      expectType<"foo" | 42 | true>(x);
      expectType<0 | 1 | 2>(index);
      return x === 42;
    })
  );
  expectType<[42]>(
    t1.filter((x, index): x is 42 => {
      expectType<"foo" | 42 | true>(x);
      expectType<0 | 1 | 2>(index);
      return x === 42;
    })
  );
  const t2: readonly [number, number, number] = [42, 42, 42];
  if (
    t2.every((x, index): x is 42 => {
      expectType<number>(x);
      expectType<0 | 1 | 2>(index);
      return x === 42;
    })
  ) {
    expectType<readonly [42, 42, 42]>(t2);
  }

  t1.some((...[x, index]) => {
    expectType<"foo" | 42 | true>(x);
    expectType<0 | 1 | 2>(index);
    return true;
  });
  t1.forEach((...[x, index]) => {
    expectType<"foo" | 42 | true>(x);
    expectType<0 | 1 | 2>(index);
  });
  expectType<["bar", "bar", "bar"]>(
    t1.map((...[x, index]) => {
      expectType<"foo" | 42 | true>(x);
      expectType<0 | 1 | 2>(index);
      return "bar" as const;
    })
  );

  expectType<"bar">(
    t1[reduce]<"bar">((p, ...[x, index]) => {
      expectType<"foo" | 42 | true | "bar">(p);
      expectType<"foo" | 42 | true>(x);
      expectType<0 | 1 | 2>(index);
      return "bar";
    })
  );
  expectType<"bar">(
    t1[reduce]<"bar">((p, ...[x, index]) => {
      expectType<"bar">(p);
      expectType<"foo" | 42 | true>(x);
      expectType<0 | 1 | 2>(index);
      return "bar";
    }, "bar")
  );

  expectError(t1.filter((x) => x));
  expectError(t1.every((x) => x));
  expectError(t1.some((x) => x));
}

// Array
{
  // https://github.com/uhyo/better-typescript-lib/issues/7
  const a1: number[] = [1, 2, 3];
  expectType<number[]>(a1.reverse());
  expectType<number>(a1.indexOf(1));
  expectType<number>(a1.lastIndexOf(1));

  expectType<number[]>(
    a1.filter((x, index) => {
      expectType<number>(x);
      expectType<number>(index);
      return x > 2;
    })
  );
  expectType<1[]>(
    a1.filter((x, index): x is 1 => {
      expectType<number>(x);
      expectType<number>(index);
      return x === 1;
    })
  );
  if (
    a1.every((x, index): x is 2 => {
      expectType<number>(x);
      expectType<number>(index);
      return x === 2;
    })
  ) {
    expectType<2[]>(a1);
  }

  a1.some((...[x, index]) => {
    expectType<number>(x);
    expectType<number>(index);
    return true;
  });
  a1.forEach((...[x, index]) => {
    expectType<number>(x);
    expectType<number>(index);
  });
  expectType<"bar"[]>(
    a1.map((...[x, index]) => {
      expectType<number>(x);
      expectType<number>(index);
      return "bar" as const;
    })
  );

  expectType<"bar">(
    a1[reduce]<"bar">((p, x, index) => {
      expectType<number | "bar">(p);
      expectType<number>(x);
      expectType<number>(index);
      return "bar";
    })
  );
  expectType<"bar">(
    a1[reduce]<"bar">((p, x, index) => {
      expectType<"bar">(p);
      expectType<number>(x);
      expectType<number>(index);
      return "bar";
    }, "bar")
  );

  expectError(a1.filter((x) => x));
  expectError(a1.every((x) => x));
  expectError(a1.some((x) => x));

  // Tuple
  const t1: ["foo", 42, true] = ["foo", 42, true];
  expectType<[true, 42, "foo"]>(t1.reverse());
  expectType<-1 | 0 | 1 | 2>(t1.indexOf(true));
  expectType<-1 | 0 | 1 | 2>(t1.lastIndexOf(true));

  // https://github.com/microsoft/TypeScript/issues/48663
  expectType<("foo" | 42 | true)[]>(
    t1.filter((...[x, index]) => {
      expectType<"foo" | 42 | true>(x);
      expectType<0 | 1 | 2>(index);
      return x === 42;
    })
  );
  expectType<[42]>(
    t1.filter((x, index): x is 42 => {
      expectType<"foo" | 42 | true>(x);
      expectType<0 | 1 | 2>(index);
      return x === 42;
    })
  );
  const t2: [number, number, number] = [42, 42, 42];
  if (
    t2.every((x, index): x is 42 => {
      expectType<number>(x);
      expectType<0 | 1 | 2>(index);
      return x === 42;
    })
  ) {
    expectType<[42, 42, 42]>(t2);
  }

  t1.some((...[x, index]) => {
    expectType<"foo" | 42 | true>(x);
    expectType<0 | 1 | 2>(index);
    return true;
  });
  t1.forEach((...[x, index]) => {
    expectType<"foo" | 42 | true>(x);
    expectType<0 | 1 | 2>(index);
  });
  expectType<["bar", "bar", "bar"]>(
    t1.map((...[x, index]) => {
      expectType<"foo" | 42 | true>(x);
      expectType<0 | 1 | 2>(index);
      return "bar" as const;
    })
  );

  expectType<"bar">(
    t1[reduce]<"bar">((p, ...[x, index]) => {
      expectType<"foo" | 42 | true | "bar">(p);
      expectType<"foo" | 42 | true>(x);
      expectType<0 | 1 | 2>(index);
      return "bar";
    })
  );
  expectType<"bar">(
    t1[reduce]<"bar">((p, ...[x, index]) => {
      expectType<"bar">(p);
      expectType<"foo" | 42 | true>(x);
      expectType<0 | 1 | 2>(index);
      return "bar";
    }, "bar")
  );

  expectError(t1.filter((x) => x));
  expectError(t1.every((x) => x));
  expectError(t1.some((x) => x));
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
