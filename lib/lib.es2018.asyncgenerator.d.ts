interface AsyncGenerator<T = unknown, TReturn = unknown, TNext = unknown>
  extends AsyncIteratorObject<T, TReturn, TNext> {
  // NOTE: 'next' is defined using a tuple to ensure we report the correct assignability errors in all places.
  next(...[value]: [] | [TNext]): Promise<IteratorResult<T, TReturn>>;
  return(
    value: TReturn | PromiseLike<TReturn>,
  ): Promise<IteratorResult<T, TReturn>>;
  throw(e: any): Promise<IteratorResult<T, TReturn>>;
  [Symbol.asyncIterator](): AsyncGenerator<T, TReturn, TNext>;
}
