/// <reference no-default-lib="true"/>

type First<T> = T extends [any] ? T[0] : unknown;

type UnionToIntersection<T> = (
  T extends any ? (arg: T) => void : never
) extends (arg: infer F) => void
  ? F
  : unknown;

type Reverse<T extends unknown[], U extends unknown[] = []> = T extends [
  infer F,
  ...infer R
]
  ? Reverse<R, [F, ...U]>
  : T extends [...infer R, infer L]
  ? [L, ...Reverse<R, U>]
  : T extends unknown[]
  ? [...T, ...U]
  : U;

type RangeArray<N extends number, A extends number[]> = A["length"] extends N
  ? A
  : RangeArray<N, [...A, A["length"]]>;

type Indices<A extends readonly unknown[]> = number extends A["length"]
  ? number
  : RangeArray<A["length"], []> extends (infer A)[]
  ? A
  : never;

type FilterMatch<T, U> = T extends Readonly<U> ? T : U extends T ? U | [] : [];

type Filter<
  T extends readonly unknown[],
  S,
  U extends unknown[] = []
> = T extends readonly [infer F, ...infer R]
  ? Filter<R, S, [...U, ...FilterMatch<[F], [S]>]>
  : T extends readonly [...infer R, infer L]
  ? [...Filter<R, S, U>, ...FilterMatch<[L], [S]>]
  : [...U, ...FilterMatch<T, S[]>];

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
