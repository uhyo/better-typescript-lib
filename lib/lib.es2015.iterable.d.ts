interface Iterator<T, TReturn = unknown, TNext = undefined> {
  // NOTE: 'next' is defined using a tuple to ensure we report the correct assignability errors in all places.
  next(...[value]: [] | [TNext]): IteratorResult<T, TReturn>;
  return?(value?: TReturn): IteratorResult<T, TReturn>;
  throw?(e?: any): IteratorResult<T, TReturn>;
}

interface Iterable<T, TReturn = unknown, TNext = undefined> {
  [Symbol.iterator](): Iterator<T, TReturn, TNext>;
}

/**
 * Describes a user-defined {@link Iterator} that is also iterable.
 */
interface IterableIterator<T, TReturn = undefined, TNext = void>
  extends Iterator<T, TReturn, TNext> {
  [Symbol.iterator](): IterableIterator<T, TReturn, TNext>;
}

interface ArrayConstructor {
  /**
   * Creates an array from an iterable object.
   * @param iterable An iterable object to convert to an array.
   */
  from<T>(iterable: Iterable<T> | ArrayLike<T>): T[];

  /**
   * Creates an array from an iterable object.
   * @param iterable An iterable object to convert to an array.
   * @param mapfn A mapping function to call on every element of the array.
   * @param thisArg Value of 'this' used to invoke the mapfn.
   */
  from<T, U, This = undefined>(
    iterable: Iterable<T> | ArrayLike<T>,
    mapfn: (this: This, v: T, k: number) => U,
    thisArg?: This,
  ): U[];
}

interface IArguments {
  /** Iterator */
  [Symbol.iterator](): ArrayIterator<unknown>;
}

interface PromiseConstructor {
  /**
   * Creates a Promise that is resolved with an array of results when all of the provided Promises
   * resolve, or rejected when any Promise is rejected.
   * @param values An iterable of Promises.
   * @returns A new Promise.
   */
  all<T>(values: Iterable<T>): Promise<Awaited<T>[]>;

  /**
   * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
   * or rejected.
   * @param values An iterable of Promises.
   * @returns A new Promise.
   */
  race<T>(values: Iterable<T>): Promise<Awaited<T>>;
}

interface MapConstructor {
  new <K, V>(iterable?: Iterable<readonly [K, V]> | null): Map<K, V>;
}

interface TypedNumberArrayConstructor {
  /**
   * Creates an array from an iterable object.
   * @param iterable An iterable object to convert to an array.
   */
  from(
    iterable: Iterable<number> | ArrayLike<number>,
  ): TypedNumberArray<ArrayBuffer>;
  /**
   * Creates an array from an iterable object.
   * @param iterable An iterable object to convert to an array.
   * @param mapfn A mapping function to call on every element of the array.
   * @param thisArg Value of 'this' used to invoke the mapfn.
   */
  from<T, This = undefined>(
    iterable: Iterable<T> | ArrayLike<T>,
    mapfn: (this: This, v: T, k: number) => number,
    thisArg?: This,
  ): TypedNumberArray<ArrayBuffer>;
}
