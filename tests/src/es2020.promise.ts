import { expectType } from "tsd";

const test = async (
  values: Iterable<string | PromiseLike<PromiseLike<number>>>
) => {
  const results = await Promise.allSettled(values);

  for (const result of results) {
    switch (result.status) {
      case "fulfilled":
        expectType<string | number>(result.value);
        break;
      case "rejected":
        expectType<unknown>(result.reason);
        break;
      default:
        expectType<never>(result);
    }
  }
};
