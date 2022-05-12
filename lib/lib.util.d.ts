/// <reference no-default-lib="true"/>

type First<T> = T extends [any] ? T[0] : unknown;

type UnionToIntersection<T> = (
  T extends any ? (arg: T) => void : never
) extends (arg: infer F) => void
  ? F
  : unknown;
