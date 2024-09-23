interface AsyncIterator<T, TReturn = unknown, TNext = undefined> {
  // NOTE: 'next' is defined using a tuple to ensure we report the correct assignability errors in all places.
  next(...[value]: [] | [TNext]): Promise<IteratorResult<T, TReturn>>;
  return?(
    value?: TReturn | PromiseLike<TReturn>,
  ): Promise<IteratorResult<T, TReturn>>;
  throw?(e?: any): Promise<IteratorResult<T, TReturn>>;
}

interface AsyncIterable<T, TReturn = unknown, TNext = undefined> {
  [Symbol.asyncIterator](): AsyncIterator<T, TReturn, TNext>;
}

/**
 * Describes a user-defined {@link AsyncIterator} that is also async iterable.
 */
interface AsyncIterableIterator<T, TReturn = unknown, TNext = undefined>
  extends AsyncIterator<T, TReturn, TNext> {
  [Symbol.asyncIterator](): AsyncIterableIterator<T, TReturn, TNext>;
}
