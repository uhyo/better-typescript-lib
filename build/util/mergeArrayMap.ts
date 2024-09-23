import { upsert } from "./upsert";

export function mergeArrayMap<K, T>(
  arrayMaps: readonly Map<K, T[]>[],
): Map<K, T[]> {
  const result = new Map<K, T[]>();
  for (const arrayMap of arrayMaps) {
    for (const [key, value] of arrayMap) {
      upsert(result, key, (array = []) => {
        return array.concat(value);
      });
    }
  }
  return result;
}
