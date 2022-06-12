interface Map<K, V> {
  forEach<This = undefined>(
    callbackfn: (this: This, value: V, key: K, map: Map<K, V>) => void,
    thisArg?: This
  ): void;
}

interface MapConstructor {
  new <K, V>(entries?: readonly (readonly [K, V])[] | null): Map<K, V>;
  readonly prototype: Map<unknown, unknown>;
}

interface WeakMapConstructor {
  new <K extends object, V>(
    entries?: readonly (readonly [K, V])[] | null
  ): WeakMap<K, V>;
}

interface ReadonlyMap<K, V> {
  forEach<This = undefined>(
    callbackfn: (this: This, value: V, key: K, map: ReadonlyMap<K, V>) => void,
    thisArg?: This
  ): void;
}

interface Set<T> {
  forEach<This = undefined>(
    callbackfn: (this: This, value: T, value2: T, set: Set<T>) => void,
    thisArg?: This
  ): void;
}

interface SetConstructor {
  new <T>(values?: readonly T[] | null): Set<T>;
  readonly prototype: Set<unknown>;
}

interface ReadonlySet<T> {
  forEach<This = undefined>(
    callbackfn: (this: This, value: T, value2: T, set: ReadonlySet<T>) => void,
    thisArg?: This
  ): void;
}
