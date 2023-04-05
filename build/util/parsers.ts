export type Parser<A> = (input: unknown) => A;

export const unknown: Parser<unknown> = (input) => input;

export const string: Parser<string> = (input) => {
  if (typeof input === "string") return input;
  throw new TypeError(`Expected a string but received ${input}`);
};

export const array =
  <A>(parser: Parser<A>): Parser<A[]> =>
  (input) => {
    if (!Array.isArray(input))
      throw new TypeError(`Expected an array but received ${input}`);
    const result = new Array<A>(input.length);
    for (let i = 0; i < input.length; i++) result[i] = parser(input[i]);
    return result;
  };

export const record =
  <A>(parser: Parser<A>): Parser<Record<string, A>> =>
  (input) => {
    if (typeof input !== "object" || input === null)
      throw new TypeError(`Expected a non-null object but received ${input}`);
    const result: Record<string, A> = {};
    for (const [key, value] of Object.entries(input))
      result[key] = parser(value);
    return result;
  };
