import { expectType } from "tsd";

// AggregateError
{
  const e = new AggregateError([1, 2, 3]);
  expectType<unknown[]>(e.errors);
}
