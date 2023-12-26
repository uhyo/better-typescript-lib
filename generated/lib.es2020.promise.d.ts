/// <reference no-default-lib="true"/>
interface PromiseFulfilledResult<T> {
  status: "fulfilled";
  value: T;
}

interface PromiseRejectedResult {
  status: "rejected";
  reason: unknown;
}
//     reason: any;

type PromiseSettledResult<T> =
  | PromiseFulfilledResult<T>
  | PromiseRejectedResult;

interface PromiseConstructor {
  /**
   * Creates a Promise that is resolved with an array of results when all
   * of the provided Promises resolve or reject.
   * @param values An array of Promises.
   * @returns A new Promise.
   */
  allSettled<T extends readonly unknown[] | []>(
    values: T
  ): Promise<{
    -readonly [P in keyof T]: PromiseSettledResult<Awaited<T[P]>>;
  }>;

  /**
   * Creates a Promise that is resolved with an array of results when all
   * of the provided Promises resolve or reject.
   * @param values An array of Promises.
   * @returns A new Promise.
   */
  allSettled<T>(
    values: Iterable<T>
  ): Promise<PromiseSettledResult<Awaited<T>>[]>;
}
//     /**
//      * Creates a Promise that is resolved with an array of results when all
//      * of the provided Promises resolve or reject.
//      * @param values An array of Promises.
//      * @returns A new Promise.
//      */
//     allSettled<T extends readonly unknown[] | []>(values: T): Promise<{ -readonly [P in keyof T]: PromiseSettledResult<Awaited<T[P]>>; }>;
//     /**
//      * Creates a Promise that is resolved with an array of results when all
//      * of the provided Promises resolve or reject.
//      * @param values An array of Promises.
//      * @returns A new Promise.
//      */
//     allSettled<T>(values: Iterable<T | PromiseLike<T>>): Promise<PromiseSettledResult<Awaited<T>>[]>;
