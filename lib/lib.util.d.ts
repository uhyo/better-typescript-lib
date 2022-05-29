/// <reference no-default-lib="true"/>

type First<T> = T extends [any] ? T[0] : unknown;

type UnionToIntersection<T> = (
  T extends any ? (arg: T) => void : never
) extends (arg: infer F) => void
  ? F
  : unknown;

/*
type Item<A extends readonly unknown[], T> = number extends A["length"]
  ? T | undefined
  : A["length"] extends 0
  ? undefined
  : T;
*/

type ReverseArray<T extends unknown[], U extends unknown[]> = T extends [
  infer F,
  ...infer R
]
  ? ReverseArray<R, [F, ...U]>
  : U;

type Reverse<A extends unknown[], T> = number extends A["length"]
  ? T[]
  : ReverseArray<A, []>;

type RangeArray<N extends number, A extends number[]> = A["length"] extends N
  ? A
  : RangeArray<N, [...A, A["length"]]>;

type Indices<A extends readonly unknown[]> = number extends A["length"]
  ? number
  : RangeArray<A["length"], []> extends (infer A)[]
  ? A
  : never;

type FilterArray<
  T extends readonly unknown[],
  S,
  U extends unknown[]
> = T extends readonly [infer F, ...infer R]
  ? FilterArray<R, S, First<F> extends S ? [...U, First<F>] : U>
  : U;

type Filter<T extends readonly unknown[], S> = number extends T["length"]
  ? S[]
  : FilterArray<{ [K in keyof T]: [T[K]] }, S, []>;

type Cast<T, U> = T extends U ? T : U;

type ValueIndexPairArray<
  T extends readonly unknown[],
  A extends unknown[] = []
> = A["length"] extends T["length"]
  ? A
  : ValueIndexPairArray<
      T,
      [...A, [value: T[A["length"]], index: A["length"], array: T]]
    >;

type ValueIndexPair<A extends readonly T[], T> = Cast<
  number extends A["length"]
    ? unknown
    : ValueIndexPairArray<A> extends (infer R)[]
    ? R
    : unknown,
  [value: T, index: number, array: A]
>;
