export function upsert<K, V>(
  map: Map<K, V>,
  key: K,
  update: (value: V | undefined) => V
) {
  const value = map.get(key);
  map.set(key, update(value));
}
