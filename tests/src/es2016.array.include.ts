import { expectType } from "tsd";

{
  // Array
  const arr1 = [1, 2, 3];
  let x1: unknown;
  if (arr1.includes(x1)) {
    expectType<number>(x1);
  }

  const arr2 = [1, 2, 3];
  const x2 = "str";
  if (arr2.includes(x2)) {
    expectType<never>(x2);
  }

  const arr3 = [1, true, "str"];
  let x3: unknown;
  if (arr3.includes(x3)) {
    expectType<string | number | boolean>(x3);
  }
}

{
  // ReadonlyArray
  const arr1 = [1, 2, 3] as const;
  let x1: unknown;
  if (arr1.includes(x1)) {
    expectType<1 | 2 | 3>(x1);
  }

  const arr2 = [1, 2, 3, "string"] as const;
  const x2 = "str";
  if (arr2.includes(x2)) {
    expectType<never>(x2);
  }

  const arr3 = [1, true, "str"] as const;
  let x3: unknown;
  if (arr3.includes(x3)) {
    expectType<1 | true | "str">(x3);
  }
}
