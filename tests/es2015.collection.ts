/// <reference path="../dist/lib/lib.es2015.d.ts" />

import { expectType } from "tsd";

// Map
{
  const map: Map<string, number> = new Map();

  map.forEach((v, k) => {
    expectType<undefined>(this);
    expectType<number>(v);
    expectType<string>(k);
  });
  map.forEach((v, k) => {
    expectType<undefined>(this);
    expectType<number>(v);
    expectType<string>(k);
  }, {});
  map.forEach(
    function () {
      expectType<string>(this.foo);
    },
    { foo: "foo" }
  );

  const map2 = new Map();
  expectType<Map<unknown, unknown>>(map2);
  expectType<unknown>(map2.get("a"));

  const map3 = new Map<string, number>();
  expectType<Map<string, number>>(map3);

  expectType<Map<unknown, unknown>>(Map.prototype);
}
// WeakMap
{
  const map: WeakMap<object, number> = new WeakMap();
  expectType<WeakMap<object, number>>(map);

  const map2 = new WeakMap();
  expectType<WeakMap<object, unknown>>(map2);
  expectType<unknown>(map2.get({}));

  expectType<WeakMap<object, unknown>>(WeakMap.prototype);
}
// Set
{
  const set = new Set();
  expectType<Set<unknown>>(set);

  const set2 = new Set([1, 2, 3]);
  set2.forEach((v) => {
    expectType<undefined>(this);
    expectType<number>(v);
  });
  set2.forEach((v) => {
    expectType<undefined>(this);
    expectType<number>(v);
  }, {});
  set2.forEach(
    function () {
      expectType<string>(this.foo);
    },
    { foo: "foo" }
  );
}

export {};
