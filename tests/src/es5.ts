import { expectError, expectType } from "tsd";

// Type Guards
type TypeGuard<A> = (value: unknown) => value is A;
const isNumber: TypeGuard<number> = (value): value is number =>
  typeof value === "number";
const isString: TypeGuard<string> = (value): value is string =>
  typeof value === "string";
const isPair =
  <A, B>(isFirst: TypeGuard<A>, isSecond: TypeGuard<B>): TypeGuard<[A, B]> =>
  (value): value is [A, B] =>
    Array.isArray(value) &&
    value.length === 2 &&
    isFirst(value[0]) &&
    isSecond(value[1]);
const isArray =
  <A>(isItem: TypeGuard<A>): TypeGuard<A[]> =>
  (value): value is A[] =>
    Array.isArray(value) && value.every((item) => isItem(item));
const isEntries = <A, B>(isKey: TypeGuard<A>, isValue: TypeGuard<B>) =>
  isArray(isPair(isKey, isValue));
const isNumberStringEntries = isEntries(isNumber, isString);

// PromiseConstructorLike
const testPromiseConstructorLike = (MyPromise: PromiseConstructorLike) => {
  new MyPromise<number>((resolve) => {
    resolve(123);
    // @ts-expect-error
    resolve();
  });
  new MyPromise<number | undefined>((resolve) => {
    resolve(123);
    resolve();
  });
  new MyPromise((resolve) => {
    resolve();
    resolve(123);
  });
};
// Promise
const testPromise = (promise: Promise<string>) => {
  expectType<Promise<string>>(promise.then());
  expectType<Promise<string>>(promise.catch());
  expectType<Promise<string>>(promise.then(null));
  expectType<Promise<string>>(promise.then(undefined));
  expectType<Promise<string>>(promise.catch(null));
  expectType<Promise<string>>(promise.catch(undefined));
  expectType<Promise<string>>(promise.then(null, null));
  expectType<Promise<string>>(promise.then(null, undefined));
  expectType<Promise<string>>(promise.then(undefined, null));
  expectType<Promise<string>>(promise.then(undefined, undefined));
  expectType<Promise<string>>(promise.then(null, (err) => `${err}`));
  expectType<Promise<string>>(promise.then(undefined, (err) => `${err}`));
  expectType<Promise<string>>(promise.catch((err) => `${err}`));
  expectType<Promise<number>>(promise.then((str) => str.length));
  expectType<Promise<number>>(promise.then((str) => str.length, null));
  expectType<Promise<number>>(promise.then((str) => str.length, undefined));
  expectType<Promise<number>>(
    promise.then((str) => Promise.resolve(str.length)),
  );
  expectType<Promise<number>>(
    promise.then(
      (str) => str.length,
      (err) => `${err}`.length,
    ),
  );
  expectType<Promise<number>>(
    promise.then(
      (str) => str.length,
      (err) => Promise.resolve(`${err}`.length),
    ),
  );
  // @ts-expect-error
  promise.then<number>((str: string) => str);
  promise.then<number>(
    (str: string) => str.length,
    // @ts-expect-error
    () => "NaN",
  );
  // @ts-expect-error
  promise.then(null, (err) => `${err}`.length);
  // @ts-expect-error
  promise.catch(null, (err) => `${err}`.length);
};

// eval
expectType<unknown>(eval("foo"));
// Object
expectType<{}>(Object());
expectType<{ foo: number }>(Object({ foo: 123 }));
expectType<{}>(Object(123));
// Object.getPrototypeOf
expectType<unknown>(Object.getPrototypeOf([]));
expectError(Object.getPrototypeOf(null));
// Object.getOwnPropertyDescriptor
expectType<PropertyDescriptor | undefined>(
  Object.getOwnPropertyDescriptor([], "foo"),
);
expectError(Object.getOwnPropertyDescriptor(null, "foo"));
// Object.getOwnPropertyNames
expectType<string[]>(Object.getOwnPropertyNames([]));
expectError(Object.getOwnPropertyNames(null));
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
  Object.create(obj1, obj),
);

// Object
{
  // https://github.com/uhyo/better-typescript-lib/issues/4
  const obj: object = {};
  if (obj.hasOwnProperty("foo")) {
    expectType<unknown>(obj.foo);
    expectType<object & { foo: unknown }>(obj);
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

// https://github.com/uhyo/better-typescript-lib/issues/13
{
  const protoObj = { protoProp: "protoProp" };

  const obj: Record<string, string> = Object.create(protoObj);
  obj.ownProp = "ownProp";

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    expectType<Record<string, string>>(obj);
    obj[key];
  }
}

// ObjectConstructor
{
  // Object.defineProperty
  expectType<{ foo: number }>(
    Object.defineProperty({}, "foo", {
      value: 123,
    }),
  );
  expectType<{ foo: number } | { bar: number }>(
    Object.defineProperty({}, "foo" as "foo" | "bar", {
      value: 123,
    }),
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
      },
    ),
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
    constructor(
      private a: number,
      private b: number,
    ) {}
  }
  expectType<typeof Foo>(Foo.bind(null));
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
  // JSON.parse
  expectType<JSONValue>(JSON.parse("{}"));
  expectType<unknown>(
    JSON.parse('{"p": 5}', (key, value) =>
      typeof value === "number" ? value * 2 : value,
    ),
  );
  expectType<JSONValue>(
    JSON.parse('{"p": 5}', (key, value) =>
      typeof value === "number" ? value * 2 : value,
    ),
  );
  expectError(
    JSON.parse('[[1,"one"],[2,"two"],[3,"three"]]', (key, value) =>
      key === "" ? new Map(value) : value,
    ),
  );
  expectType<unknown>(
    JSON.parse('[[1,"one"],[2,"two"],[3,"three"]]', (key, value) =>
      key === "" && isNumberStringEntries(value) ? new Map(value) : value,
    ),
  );
  type JSONValueWithMap1 = JSONValue | Map<number, string>;
  expectError(
    JSON.parse<JSONValueWithMap1>(
      '[[1,"one"],[2,"two"],[3,"three"]]',
      (key, value) =>
        key === "" && isNumberStringEntries(value) ? new Map(value) : value,
    ),
  );
  type JSONValueWithMap2 = JSONValueF<JSONValue | Map<number, string>>;
  expectError(
    JSON.parse<JSONValueWithMap2>(
      '[[1,"one"],[2,"two"],[3,"three"]]',
      (key, value) =>
        key === "" && isNumberStringEntries(value) ? new Map(value) : value,
    ),
  );
  type JSONValueWithMap3 =
    | JSONPrimitive
    | Map<number, string>
    | { [key: string]: JSONValueWithMap3 }
    | JSONValueWithMap3[];
  expectType<JSONValueWithMap3>(
    JSON.parse<JSONValueWithMap3>(
      '[[1,"one"],[2,"two"],[3,"three"]]',
      (key, value) =>
        key === "" && isNumberStringEntries(value) ? new Map(value) : value,
    ),
  );

  // JSON.stringify
  const arr = [1, 2, "foo"];
  expectType<string>(JSON.stringify(arr));
  const obj = { foo: { bar: 1 } };
  expectType<string>(JSON.stringify(obj));
  const readonlyArr = [1, 2, 3] as const;
  expectType<string>(JSON.stringify(readonlyArr));
  const readonlyObj = { foo: { bar: 1 } } as const;
  expectType<string>(JSON.stringify(readonlyObj));
  const value = null as string | Record<string, unknown> | any[] | null;
  expectType<string>(JSON.stringify(value));

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
  const aVoid: void = undefined;
  expectType<string | undefined>(JSON.stringify(aVoid));
  const unknown: unknown = 123;
  expectType<string | undefined>(JSON.stringify(unknown));
  const any: any = 123;
  expectType<string | undefined>(JSON.stringify(any));
  const undefOrNum = Math.random() < 0.5 ? undefined : 123;
  expectType<string | undefined>(JSON.stringify(undefOrNum));
  const funcOrNum = Math.random() < 0.5 ? () => {} : 123;
  expectType<string | undefined>(JSON.stringify(funcOrNum));
  const empty = {};
  expectType<string | undefined>(JSON.stringify(empty));
  const o: object = () => {};
  expectType<string | undefined>(JSON.stringify(o));
  const nullish = null as Record<string, unknown> | any[] | null | undefined;
  expectType<string | undefined>(JSON.stringify(nullish));

  // JSON.stringify with replacer function
  const importantDates = new Map<string, Date>();
  expectError(
    JSON.stringify(importantDates, (key, value) => Object.fromEntries(value)),
  );
  expectError(
    JSON.stringify<Map<string, Date>>(importantDates, (key, value) =>
      Object.fromEntries(value),
    ),
  );
  type Value = Date | Map<string, Date>;
  expectType<string>(
    JSON.stringify<Value>(importantDates, (key, value) =>
      typeof value === "string" ? value : Object.fromEntries(value),
    ),
  );
  expectType<string | undefined>(
    JSON.stringify<Value>(importantDates, (key, value) => {
      if (typeof value !== "string") return Object.fromEntries(value);
      return new Date(value) < new Date("1900-01-01") ? undefined : value;
    }),
  );
}

// ReadonlyArray
{
  // https://github.com/uhyo/better-typescript-lib/issues/7
  const a1: readonly number[] = [1, 2, 3];
  expectType<number[]>(a1.filter((x) => x > 2));
  expectType<1[]>(a1.filter((x): x is 1 => x === 1));
  if (a1.every((x): x is 2 => x === 2)) {
    expectType<readonly 2[]>(a1);
  }
  expectType<string | number>(
    a1.reduce((x) => {
      expectType<string | number>(x);
      return "foo";
    }),
  );
  expectType<string>(
    a1.reduce((x) => {
      expectType<string>(x);
      return "foo";
    }, "foo"),
  );
  expectType<(typeof a1)["reduce"]>(a1.reduceRight);

  expectError(a1.filter((x) => x));
  expectError(a1.every((x) => x));
  expectError(a1.some((x) => x));

  const a2: readonly [number, number, number] = [1, 2, 3];
  if (
    a2.every((x, i, a3): x is 2 => {
      expectType<typeof a2>(a3);
      return x === 2;
    })
  ) {
    expectType<readonly [2, 2, 2]>(a2);
  }
  expectType<[string, string, string]>(a2.map(() => "foo"));
}

// Array
{
  // https://github.com/uhyo/better-typescript-lib/issues/7
  const a1: number[] = [1, 2, 3];
  expectType<number[]>(a1.filter((x) => x > 2));
  expectType<1[]>(a1.filter((x): x is 1 => x === 1));
  if (a1.every((x): x is 2 => x === 2)) {
    expectType<2[]>(a1);
  }
  expectType<string | number>(
    a1.reduce((x) => {
      expectType<string | number>(x);
      return "foo";
    }),
  );
  expectType<string>(
    a1.reduce((x) => {
      expectType<string>(x);
      return "foo";
    }, "foo"),
  );
  expectType<(typeof a1)["reduce"]>(a1.reduceRight);

  expectError(a1.filter((x) => x));
  expectError(a1.every((x) => x));
  expectError(a1.some((x) => x));

  const a2: [number, number, number] = [1, 2, 3];
  if (
    a2.every((x, i, a3): x is 2 => {
      expectType<typeof a2>(a3);
      return x === 2;
    })
  ) {
    expectType<[2, 2, 2]>(a2);
  }
  expectType<[string, string, string]>(a2.map(() => "foo"));

  // https://github.com/uhyo/better-typescript-lib/issues/35
  function template(strings: TemplateStringsArray, ...keys: string[]): void {
    const mapped = strings.map((v) => v);
    expectType<number>(mapped.length);
  }
  {
    class ArrX extends Array<number> {
      constructor(nums: number[]) {
        super(...nums);
      }

      sum(): number {
        return this.reduce((s, n) => s + n, 0);
      }
    }
    const arrX = new ArrX([2, 3, 4]);
    const mapped = arrX.map((v) => String(v));
    expectType<number>(mapped.length);
  }
  {
    const arr = [1, 2, 3];
    function magic<T>(check: (value: T) => void): T {
      return {} as T;
    }
    // Check that inference of U from contextual type works
    const mapped: string[] = arr.map((v) =>
      magic((value) => {
        expectType<string>(value);
      }),
    );
  }
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

// TypedNumberArray
{
  for (const TypedNumberArray of [
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,
  ]) {
    const a1 = new TypedNumberArray();
    expectError(a1.filter((x) => x));
    expectError(a1.every((x) => x));
    expectError(a1.some((x) => x));
    expectError(a1.find((x) => x));
    expectError(a1.findIndex((x) => x));
  }
}

export {};
