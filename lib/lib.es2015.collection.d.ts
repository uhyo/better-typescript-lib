interface Map<K, V> {
  clear(): void;
  delete(key: K): boolean;
  forEach<This = undefined>(
    callbackfn: (this: This, value: V, key: K, map: Map<K, V>) => void,
    thisArg?: This
  ): void;
  get(key: K): V | undefined;
  has(key: K): boolean;
  set(key: K, value: V): this;
  readonly size: number;
}

interface MapConstructor {
  new <K, V>(entries?: readonly (readonly [K, V])[] | null): Map<K, V>;
  readonly prototype: Map<unknown, unknown>;
}

declare var Map: MapConstructor;

interface WeakMap<K extends object, V> {
  delete(key: K): boolean;
  get(key: K): V | undefined;
  has(key: K): boolean;
  set(key: K, value: V): this;
}

interface WeakMapConstructor {
  new <K extends object, V>(
    entries?: readonly (readonly [K, V])[] | null
  ): WeakMap<K, V>;
  readonly prototype: WeakMap<object, unknown>;
}
declare var WeakMap: WeakMapConstructor;

interface ReadonlyMap<K, V> {
  forEach<This = undefined>(
    callbackfn: (this: This, value: V, key: K, map: ReadonlyMap<K, V>) => void,
    thisArg?: This
  ): void;
  get(key: K): V | undefined;
  has(key: K): boolean;
  readonly size: number;
}

interface Set<T> {
  add(value: T): this;
  clear(): void;
  delete(value: T): boolean;
  forEach<This = undefined>(
    callbackfn: (this: This, value: T, value2: T, set: Set<T>) => void,
    thisArg?: This
  ): void;
  has(value: T): boolean;
  readonly size: number;
}

interface SetConstructor {
  new <T>(values?: readonly T[] | null): Set<T>;
  readonly prototype: Set<unknown>;
}
declare var Set: SetConstructor;

interface ReadonlySet<T> {
  forEach<This = undefined>(
    callbackfn: (this: This, value: T, value2: T, set: ReadonlySet<T>) => void,
    thisArg?: This
  ): void;
  has(value: T): boolean;
  readonly size: number;
}
