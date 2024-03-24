import { expectType } from "tsd";

const test = async (
  values: Iterable<string | PromiseLike<PromiseLike<number>>>,
) => {
  const result = await Promise.any(values);
  expectType<string | number>(result);
};
