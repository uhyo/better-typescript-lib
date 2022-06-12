interface NumberConstructor {
  /**
   * Returns true if passed value is finite.
   * Unlike the global isFinite, Number.isFinite doesn't forcibly convert the parameter to a
   * number. Only finite values of the type number, result in true.
   * @param number A numeric value.
   */
  isFinite(number: unknown): number is number;

  /**
   * Returns true if the value passed is an integer, false otherwise.
   * @param number A numeric value.
   */
  isInteger(number: unknown): number is number;

  /**
   * Returns a Boolean value that indicates whether a value is the reserved value NaN (not a
   * number). Unlike the global isNaN(), Number.isNaN() doesn't forcefully convert the parameter
   * to a number. Only values of the type number, that are also NaN, result in true.
   * @param number A numeric value.
   */
  isNaN(number: unknown): number is number;

  /**
   * Returns true if the value passed is a safe integer.
   * @param number A numeric value.
   */
  isSafeInteger(number: unknown): number is number;
}

interface ObjectConstructor {
  /**
   * Copy the values of all of the enumerable own properties from one or more source objects to a
   * target object. Returns the target object.
   * @param target The target object to copy to.
   * @param sources One or more source objects from which to copy properties
   */
  assign<T, Ts extends readonly any[]>(
    target: T,
    ...sources: Ts
  ): First<UnionToIntersection<[T] | { [K in keyof Ts]: [Ts[K]] }[number]>>;

  /**
   * Returns true if the values are the same value, false otherwise.
   * @param value1 The first value.
   * @param value2 The second value.
   */
  is<T>(value1: T, value2: T): boolean;

  /**
   * Sets the prototype of a specified object o to object proto or null. Returns the object o.
   * @param o The object to change its prototype.
   * @param proto The value of the new prototype or null.
   */
  setPrototypeOf<T extends object, U extends object>(o: T, proto: U): T & U;

  /**
   * Sets the prototype of a specified object o to object proto or null. Returns the object o.
   * @param o The object to change its prototype.
   * @param proto The value of the new prototype or null.
   */
  setPrototypeOf<T extends object>(o: T, proto: null): T;
}

interface String {
  /**
   * Returns the String value result of normalizing the string into the normalization form
   * named by form as specified in Unicode Standard Annex #15, Unicode Normalization Forms.
   * @param form Applicable values: "NFC", "NFD", "NFKC", or "NFKD", If not specified default
   * is "NFC"
   */
  normalize(form?: "NFC" | "NFD" | "NFKC" | "NFKD"): string;
}
