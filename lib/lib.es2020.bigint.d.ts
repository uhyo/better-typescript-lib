interface TypedBigIntArray {
  /**
   * Determines whether all the members of an array satisfy the specified test.
   * @param predicate A function that accepts up to three arguments. The every method calls
   * the predicate function for each element in the array until the predicate returns false,
   * or until the end of the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  every<This = undefined>(
    predicate: (
      this: This,
      value: bigint,
      index: number,
      array: this
    ) => boolean,
    thisArg?: This
  ): boolean;
  /**
   * Returns the elements of an array that meet the condition specified in a callback function.
   * @param predicate A function that accepts up to three arguments. The filter method calls
   * the predicate function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  filter<This = undefined>(
    predicate: (
      this: This,
      value: bigint,
      index: number,
      array: this
    ) => boolean,
    thisArg?: This
  ): TypedBigIntArray;
  /**
   * Returns the value of the first element in the array where predicate is true, and undefined
   * otherwise.
   * @param predicate find calls predicate once for each element of the array, in ascending
   * order, until it finds one where predicate returns true. If such an element is found, find
   * immediately returns that element value. Otherwise, find returns undefined.
   * @param thisArg If provided, it will be used as the this value for each invocation of
   * predicate. If it is not provided, undefined is used instead.
   */
  find<This = undefined>(
    predicate: (
      this: This,
      value: bigint,
      index: number,
      array: this
    ) => boolean,
    thisArg?: This
  ): bigint | undefined;
  /**
   * Returns the index of the first element in the array where predicate is true, and -1
   * otherwise.
   * @param predicate find calls predicate once for each element of the array, in ascending
   * order, until it finds one where predicate returns true. If such an element is found,
   * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
   * @param thisArg If provided, it will be used as the this value for each invocation of
   * predicate. If it is not provided, undefined is used instead.
   */
  findIndex<This = undefined>(
    predicate: (
      this: This,
      value: bigint,
      index: number,
      array: this
    ) => boolean,
    thisArg?: This
  ): number;
  /**
   * Performs the specified action for each element in an array.
   * @param callbackfn A function that accepts up to three arguments. forEach calls the
   * callbackfn function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  forEach<This = undefined>(
    callbackfn: (this: This, value: bigint, index: number, array: this) => void,
    thisArg?: This
  ): void;
  /**
   * Calls a defined callback function on each element of an array, and returns an array that
   * contains the results.
   * @param callbackfn A function that accepts up to three arguments. The map method calls the
   * callbackfn function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  map<This = undefined>(
    callbackfn: (
      this: This,
      value: bigint,
      index: number,
      array: this
    ) => bigint,
    thisArg?: This
  ): TypedBigIntArray;
  /**
   * Calls the specified callback function for all the elements in an array. The return value of
   * the callback function is the accumulated result, and is provided as an argument in the next
   * call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
   * callbackfn function one time for each element in the array.
   */
  reduce<U = bigint>(
    callbackfn: (
      previousValue: bigint | U,
      currentValue: bigint,
      currentIndex: number,
      array: this
    ) => U
  ): bigint | U;
  /**
   * Calls the specified callback function for all the elements in an array. The return value of
   * the callback function is the accumulated result, and is provided as an argument in the next
   * call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
   * callbackfn function one time for each element in the array.
   * @param initialValue If initialValue is specified, it is used as the initial value to start
   * the accumulation. The first call to the callbackfn function provides this value as an argument
   * instead of an array value.
   */
  reduce<U = bigint>(
    callbackfn: (
      previousValue: U,
      currentValue: bigint,
      currentIndex: number,
      array: this
    ) => U,
    initialValue: U
  ): U;
  /**
   * Calls the specified callback function for all the elements in an array, in descending order.
   * The return value of the callback function is the accumulated result, and is provided as an
   * argument in the next call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
   * the callbackfn function one time for each element in the array.
   */
  reduceRight<U = bigint>(
    callbackfn: (
      previousValue: bigint | U,
      currentValue: bigint,
      currentIndex: number,
      array: this
    ) => U
  ): bigint | U;
  /**
   * Calls the specified callback function for all the elements in an array, in descending order.
   * The return value of the callback function is the accumulated result, and is provided as an
   * argument in the next call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
   * the callbackfn function one time for each element in the array.
   * @param initialValue If initialValue is specified, it is used as the initial value to start
   * the accumulation. The first call to the callbackfn function provides this value as an argument
   * instead of an array value.
   */
  reduceRight<U = bigint>(
    callbackfn: (
      previousValue: U,
      currentValue: bigint,
      currentIndex: number,
      array: this
    ) => U,
    initialValue: U
  ): U;
  /**
   * Determines whether the specified callback function returns true for any element of an array.
   * @param predicate A function that accepts up to three arguments. The some method calls the
   * predicate function for each element in the array until the predicate returns true, or until
   * the end of the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  some<This = undefined>(
    predicate: (
      this: This,
      value: bigint,
      index: number,
      array: this
    ) => boolean,
    thisArg?: This
  ): boolean;
}

interface TypedBigIntArrayConstructor {
  /**
   * Creates an array from an array-like or iterable object.
   * @param arrayLike An array-like or iterable object to convert to an array.
   */
  from(arrayLike: Iterable<bigint> | ArrayLike<bigint>): TypedBigIntArray;
  /**
   * Creates an array from an array-like or iterable object.
   * @param arrayLike An array-like or iterable object to convert to an array.
   * @param mapfn A mapping function to call on every element of the array.
   * @param thisArg Value of 'this' used to invoke the mapfn.
   */
  from<T, This = undefined>(
    arrayLike: Iterable<T> | ArrayLike<T>,
    mapfn: (this: This, v: T, k: number) => bigint,
    thisArg?: This
  ): TypedBigIntArray;
}
