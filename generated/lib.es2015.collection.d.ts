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
//     forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;

interface MapConstructor {
  new <K, V>(entries?: readonly (readonly [K, V])[] | null): Map<K, V>;
  readonly prototype: Map<unknown, unknown>;
}
//     new(): Map<any, any>;
//     new<K, V>(entries?: readonly (readonly [K, V])[] | null): Map<K, V>;
//     readonly prototype: Map<any, any>;

declare var Map: MapConstructor;
interface ReadonlyMap<K, V> {
  forEach<This = undefined>(
    callbackfn: (this: This, value: V, key: K, map: ReadonlyMap<K, V>) => void,
    thisArg?: This
  ): void;
  get(key: K): V | undefined;
  has(key: K): boolean;
  readonly size: number;
}
//     forEach(callbackfn: (value: V, key: K, map: ReadonlyMap<K, V>) => void, thisArg?: any): void;

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
  readonly prototype: WeakMap<object, any>;
}
//     new <K extends object = object, V = any>(entries?: readonly [K, V][] | null): WeakMap<K, V>;

declare var WeakMap: WeakMapConstructor;
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
//     forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void;

interface SetConstructor {
  new <T>(values?: readonly T[] | null): Set<T>;
  readonly prototype: Set<unknown>;
}
//     new <T = any>(values?: readonly T[] | null): Set<T>;
//     readonly prototype: Set<any>;

declare var Set: SetConstructor;
interface ReadonlySet<T> {
  forEach<This = undefined>(
    callbackfn: (this: This, value: T, value2: T, set: ReadonlySet<T>) => void,
    thisArg?: This
  ): void;
  has(value: T): boolean;
  readonly size: number;
}
//     forEach(callbackfn: (value: T, value2: T, set: ReadonlySet<T>) => void, thisArg?: any): void;

interface WeakSet<T extends object> {
  add(value: T): this;
  delete(value: T): boolean;
  has(value: T): boolean;
}

interface WeakSetConstructor {
  new <T extends object = object>(values?: readonly T[] | null): WeakSet<T>;
  readonly prototype: WeakSet<object>;
}
declare var WeakSet: WeakSetConstructor;
