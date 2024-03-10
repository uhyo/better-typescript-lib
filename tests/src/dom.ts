import { expectNotType, expectType } from "tsd";

const test = async (url: string) => {
  const response = await fetch(url);
  const json = await response.json();
  expectType<JSONValue>(json);
};

// structuredClone
{
  // primitives
  expectType<5>(structuredClone(5));
  expectType<"hello">(structuredClone("hello"));
  expectType<true>(structuredClone(true));
  expectType<undefined>(structuredClone(undefined));
  expectType<null>(structuredClone(null));
  // plain objects
  expectType<{ a: 5 }>(structuredClone({ a: 5 }));
  expectType<{
    a: 5;
    nested: {
      b: "hello";
    };
  }>(structuredClone({ a: 5, nested: { b: "hello" } }));
  const obj = { a: 5 };
  expectType<{ a: number }>(structuredClone(obj));
  // arrays
  expectType<[1, 2, 3]>(structuredClone([1, 2, 3]));
  expectType<["a", "b", "c"]>(structuredClone(["a", "b", "c"]));
  const arr = [1, 2, 3];
  expectType<number[]>(structuredClone(arr));
  // read-onlyness is removed
  {
    const a: readonly number[] = [1, 2, 3];
    const b = structuredClone(a);
    expectType<number[]>(b);
    b.push(4);
  }
  // TypedArrays
  expectType<Int16Array>(structuredClone(new Int16Array()));
  {
    // class instances are converted to base built-in types
    class Weirdo extends Int16Array {
      public weirdo: undefined = undefined;
    }

    class Weirdo2 extends Int32Array {
      public weirdo2: undefined = undefined;
    }

    expectType<Int16Array>(structuredClone(new Weirdo()));

    // @ts-expect-error property does not exist
    structuredClone(new Weirdo()).weirdo;
    const f: readonly [Weirdo] = [new Weirdo()] as const;
    expectType<[Int16Array]>(structuredClone(f));
    // @ts-expect-error property does not exist
    structuredClone(f)[0].weirdo;

    const g = { a: new Weirdo() };
    const g2 = structuredClone(g);
    expectType<{ a: Int16Array }>(g2);
    // @ts-expect-error property does not exist
    g2.a.weirdo;

    const h = new Map([[new Weirdo(), new Weirdo2()]]);
    const i = structuredClone(h);
    expectType<Map<Int16Array, Int32Array>>(i);
    expectNotType<Map<Weirdo, Weirdo2>>(i);

    const j = new Set([new Weirdo()]);
    const k: Set<Int16Array> = structuredClone(j);
    expectNotType<Set<Weirdo>>(k);

    class Empty {}
    expectType<{}>(structuredClone(new Empty()));
    class SingleProp {
      hello: number = 3;
    }
    expectType<{ hello: number }>(structuredClone(new SingleProp()));

    class WithConstructor {
      hi: number;
      constructor(hi: number) {
        this.hi = hi;
      }
    }

    expectType<{ hi: number }>(structuredClone(new WithConstructor(1)));

    class WithFunction {
      hello(): "hi" {
        return "hi";
      }
    }

    expectType<{}>(structuredClone(new WithFunction()));
    // @ts-expect-error
    structuredClone(new WithFunction()).hello();
    //    ^?
    const x = structuredClone({ s: () => 1 });
    //    ^?
  }
  // non-clonable objects
  {
    // @ts-expect-error
    const m = structuredClone(class {});
    // @ts-expect-error
    const n = structuredClone(Symbol.iterator);
    // @ts-expect-error
    const p = structuredClone(() => 1);
  }
}
