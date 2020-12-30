/// <reference path="../dist/lib/lib.es2015.d.ts" />

import { expectType } from "tsd";

// PromiseConstructor
expectType<unknown>(await Promise.prototype);
new Promise<number>((resolve) => {
  resolve(123);
  // @ts-expect-error
  resolve();
});
new Promise((resolve) => {
  resolve();
  resolve(123);
});

(function <T>() {
  new Promise<T>((resolve) => {
    const t = {} as T;
    resolve(t);
  });
});
{
  const num = Promise.resolve(123);
  const str = Promise.resolve("wow");
  const bool = Promise.resolve(true);
  const [v1, v2, v3] = await Promise.all([num, str, bool]);
  expectType<number>(v1);
  expectType<string>(v2);
  expectType<boolean>(v3);

  const a = await Promise.all([num, str, bool]);
  expectType<number>(a[0]);
  expectType<string>(a[1]);
  expectType<boolean>(a[2]);

  const ps: Promise<string | number>[] = [num, str, num];
  const [v4, v5, v6] = await Promise.all(ps);
  expectType<string | number>(v4);
  expectType<string | number>(v5);
  expectType<string | number>(v6);
}
{
  const p1 = Promise.resolve(123);
  expectType<Promise<number>>(p1);
  const p2 = Promise.resolve<Promise<number>>(p1);
  expectType<Promise<number>>(p2);
}

(async function (): Promise<number> {
  return 3;
});
