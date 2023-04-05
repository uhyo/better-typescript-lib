import { expectType } from "tsd";

const test = async (url: string) => {
  const response = await fetch(url);
  const json = await response.json();
  expectType<JSONValue>(json);
};
