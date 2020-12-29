/// <reference path="../dist/lib/lib.es2015.d.ts" />

import { expectType } from "tsd";

// Array
{
  const arr = [1, 2, 3];
  const n = arr[Symbol.iterator]().next();
  if (n.done) {
    expectType<undefined>(n.value);
  } else {
    expectType<number>(n.value);
  }
}
// IArguments
{
  (function () {
    for (const v of arguments) {
      expectType<unknown>(v);
    }
  })();
}
// Map
{
  const map = new Map([
    [1, 1],
    [2, 3],
    [3, 6],
  ]);
  const n = map[Symbol.iterator]().next();
  if (n.done) {
    expectType<undefined>(n.value);
  } else {
    expectType<[number, number]>(n.value);
  }
}
// ReadonlyMap
{
  const map: ReadonlyMap<number, number> = new Map();
  const n = map[Symbol.iterator]().next();
  if (n.done) {
    expectType<undefined>(n.value);
  } else {
    expectType<[number, number]>(n.value);
  }
}
// Set
{
  const set = new Set([1, 2, 3]);
  const n = set[Symbol.iterator]().next();
  if (n.done) {
    expectType<undefined>(n.value);
  } else {
    expectType<number>(n.value);
  }
}
// ReadonlySet
{
  const set: ReadonlySet<number> = new Set();
  const n = set[Symbol.iterator]().next();
  if (n.done) {
    expectType<undefined>(n.value);
  } else {
    expectType<number>(n.value);
  }
}
// PromiseConstructor
{
  const it: Iterable<number | Promise<string>> = [];
  const w = await Promise.all(it);
  expectType<(string | number)[]>(w);
  const w2 = await Promise.race(it);
  expectType<string | number>(w2);
}
