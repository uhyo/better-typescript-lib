interface ObjectConstructor {
  /**
   * Returns an object created by key-value entries for properties and methods
   * @param entries An iterable object that contains key-value entries for properties and methods.
   */
  fromEntries<T extends readonly [PropertyKey, unknown]>(
    entries: Iterable<T>,
  ): Record<T[0], T[1]>;
}
