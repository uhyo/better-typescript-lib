type First<T> = T extends [any] ? T[0] : unknown;

type UnionToIntersection<T> = (
  T extends any ? (arg: T) => void : never
) extends (arg: infer F) => void
  ? F
  : unknown;

/**
 * Evaluates JavaScript code and executes it.
 * @param x A String value that contains valid JavaScript code.
 */
declare function eval(x: string): unknown;

interface Object {
  /**
   * Determines whether an object has a property with the specified name.
   * @param v A property name.
   */
  hasOwnProperty<Key extends PropertyKey>(
    v: Key
  ): this is string extends Key
    ? {}
    : number extends Key
    ? {}
    : symbol extends Key
    ? {}
    : Key extends PropertyKey
    ? { [key in Key]: unknown }
    : {};
}

interface ObjectConstructor {
  new (value?: any): Object;
  (): {};
  <T>(value: T): T extends object ? T : {};

  /**
   * Returns the prototype of an object.
   * @param o The object that references the prototype.
   */
  getPrototypeOf(o: any): unknown;

  /**
   * Returns the names of the own properties of an object. The own properties of an object are those that are defined directly
   * on that object, and are not inherited from the object's prototype. The properties of an object include both fields (objects) and functions.
   * @param o Object that contains the own properties.
   */
  getOwnPropertyNames<O>(o: O): O extends undefined | null ? never : string[];

  /**
   * Creates an object that has the specified prototype or that has null prototype.
   * @param o Object to use as a prototype. May be null.
   */
  create<O extends object>(o: O): O;

  /**
   * Creates an object that has the specified prototype or that has null prototype.
   * @param o Object to use as a prototype. May be null.
   */
  create(o: null): {};

  /**
   * Creates an object that has the specified prototype, and that optionally contains specified properties.
   * @param o Object to use as a prototype. May be null
   * @param properties JavaScript object that contains one or more property descriptors.
   */
  create<O extends object, P extends Record<PropertyKey, PropertyDescriptor>>(
    o: O,
    properties: P & ThisType<any>
  ): {
    [K in keyof (O & P)]: P[K] extends { value: infer V }
      ? V
      : P[K] extends { get: () => infer V }
      ? V
      : K extends keyof O
      ? O[K]
      : unknown;
  };

  /**
   * Creates an object that has the specified prototype, and that optionally contains specified properties.
   * @param o Object to use as a prototype. May be null
   * @param properties JavaScript object that contains one or more property descriptors.
   */
  create<P extends Record<string, PropertyDescriptor>>(
    o: null,
    properties: P & ThisType<any>
  ): {
    [K in keyof P]: P[K] extends { value: infer V }
      ? V
      : P[K] extends { get: () => infer V }
      ? V
      : unknown;
  };

  /**
   * Adds a property to an object, or modifies attributes of an existing property.
   * @param o Object on which to add or modify the property. This can be a native JavaScript object (that is, a user-defined object or a built in object) or a DOM object.
   * @param p The property name.
   * @param attributes Descriptor for the property. It can be for a data property or an accessor property.
   */
  defineProperty<
    O extends object,
    P extends PropertyKey,
    D extends PropertyDescriptor
  >(
    o: O,
    p: P,
    attributes: D & ThisType<any>
  ): O &
    (P extends PropertyKey // required to make P distributive
      ? {
          [K in P]: D extends { value: infer V }
            ? V
            : D extends { get: () => infer V }
            ? V
            : unknown;
        }
      : unknown);

  /**
   * Adds one or more properties to an object, and/or modifies attributes of existing properties.
   * @param o Object on which to add or modify the properties. This can be a native JavaScript object or a DOM object.
   * @param properties JavaScript object that contains one or more descriptor objects. Each descriptor object describes a data property or an accessor property.
   */
  defineProperties<
    O extends object,
    P extends Record<PropertyKey, PropertyDescriptor>
  >(
    o: O,
    properties: P & ThisType<any>
  ): {
    [K in keyof (O & P)]: P[K] extends { value: infer V }
      ? V
      : P[K] extends { get: () => infer V }
      ? V
      : K extends keyof O
      ? O[K]
      : unknown;
  };
}

interface CallableFunction extends Function {
  /**
   * For a given function, creates a bound function that has the same body as the original function.
   * The this object of the bound function is associated with the specified object, and has the specified initial parameters.
   * @param thisArg The object to be used as the this object.
   * @param args Arguments to bind to the parameters of the function.
   */
  bind<T, A extends readonly any[], B extends readonly any[], R>(
    this: (this: T, ...args: [...A, ...B]) => R,
    thisArg: T,
    ...args: A
  ): (...args: B) => R;
}

interface NewableFunction extends Function {
  /**
   * Calls the function with the specified object as the this value and the elements of specified array as the arguments.
   * @param thisArg The object to be used as the this object.
   */
  apply<T>(this: new () => T, thisArg: T): void;

  /**
   * Calls the function with the specified object as the this value and the elements of specified array as the arguments.
   * @param thisArg The object to be used as the this object.
   * @param args An array of argument values to be passed to the function.
   */
  apply<T, A extends any[]>(
    this: new (...args: A) => T,
    thisArg: T,
    args: A
  ): void;

  /**
   * Calls the function with the specified object as the this value and the specified rest arguments as the arguments.
   * @param thisArg The object to be used as the this object.
   * @param args Argument values to be passed to the function.
   */
  call<T, A extends any[]>(
    this: new (...args: A) => T,
    thisArg: T,
    ...args: A
  ): void;

  /**
   * For a given function, creates a bound function that has the same body as the original function.
   * The this object of the bound function is associated with the specified object, and has the specified initial parameters.
   * @param thisArg The object to be used as the this object.
   * @param args Arguments to bind to the parameters of the function.
   */
  bind<A extends readonly any[], B extends readonly any[], R>(
    this: new (...args: [...A, ...B]) => R,
    thisArg: any,
    ...args: A
  ): new (...args: B) => R;
}

interface IArguments {
  [index: number]: unknown;
}

interface String {
  /**
   * Replaces text in a string, using a regular expression or search string.
   * @param searchValue A string or RegExp search value.
   * @param replaceValue A string containing the text to replace for every successful match of searchValue in this string.
   */
  replace(searchValue: string | RegExp, replaceValue: string): string;

  /**
   * Replaces text in a string, using a regular expression or search string.
   * @param searchValue A string or RegExp search value.
   * @param replacer A function that returns the replacement text.
   */
  replace(
    searchValue: string | RegExp,
    replacer: (
      substring: string,
      // TODO: could be improved, but blocked by issue:
      // https://github.com/microsoft/TypeScript/issues/45972
      ...rest: (string | number)[]
    ) => string
  ): string;
}

type JSONValue =
  | null
  | string
  | number
  | boolean
  | {
      [K in string]?: JSONValue;
    }
  | JSONValue[];

interface JSON {
  /**
   * Converts a JavaScript Object Notation (JSON) string into an object.
   * @param text A valid JSON string.
   * @param reviver A function that transforms the results. This function is called for each member of the object.
   * If a member contains nested objects, the nested objects are transformed before the parent object is.
   */
  parse(
    text: string,
    reviver?: (this: JSONValue, key: string, value: JSONValue) => any
  ): JSONValue;
  /**
   * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
   * @param value A JavaScript value, usually an object or array, to be converted.
   * @param replacer A function that transforms the results.
   * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
   */
  stringify<T>(
    value: T,
    replacer?: (this: unknown, key: string, value: unknown) => any,
    space?: string | number | null
  ): T extends unknown
    ? T extends
        | undefined
        | ((...args: any) => any)
        | (new (...args: any) => any)
        | symbol
      ? undefined
      : object extends T
      ? string | undefined
      : string
    : never;
  /**
   * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
   * @param value A JavaScript value, usually an object or array, to be converted.
   * @param replacer A function that transforms the results.
   * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
   */
  stringify(
    value: unknown,
    replacer?: (this: unknown, key: string, value: unknown) => any,
    space?: string | number | null
  ): string | undefined;
  /**
   * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
   * @param value A JavaScript value, usually an object or array, to be converted.
   * @param replacer An array of strings and numbers that acts as an approved list for selecting the object properties that will be stringified.
   * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
   */
  stringify<T>(
    value: T,
    replacer?: (number | string)[] | null,
    space?: string | number | null
  ): T extends unknown
    ? T extends
        | undefined
        | ((...args: any) => any)
        | (new (...args: any) => any)
        | symbol
      ? undefined
      : object extends T
      ? string | undefined
      : string
    : never;
  /**
   * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
   * @param value A JavaScript value, usually an object or array, to be converted.
   * @param replacer An array of strings and numbers that acts as an approved list for selecting the object properties that will be stringified.
   * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
   */
  stringify(
    value: unknown,
    replacer?: (number | string)[] | null,
    space?: string | number | null
  ): string | undefined;
}

interface ReadonlyArray<T> {
  /**
   * Determines whether all the members of an array satisfy the specified test.
   * @param predicate A function that accepts up to three arguments. The every method calls
   * the predicate function for each element in the array until the predicate returns a value
   * which is coercible to the Boolean value false, or until the end of the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  every<S extends T, This = undefined>(
    predicate: (
      this: This,
      value: T,
      index: number,
      array: readonly T[]
    ) => value is S,
    thisArg?: This
  ): this is readonly S[];
  /**
   * Determines whether all the members of an array satisfy the specified test.
   * @param predicate A function that accepts up to three arguments. The every method calls
   * the predicate function for each element in the array until the predicate returns a value
   * which is coercible to the Boolean value false, or until the end of the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  every<This = undefined>(
    predicate: (
      this: This,
      value: T,
      index: number,
      array: readonly T[]
    ) => boolean,
    thisArg?: This
  ): boolean;
  /**
   * Determines whether the specified callback function returns true for any element of an array.
   * @param predicate A function that accepts up to three arguments. The some method calls
   * the predicate function for each element in the array until the predicate returns a value
   * which is coercible to the Boolean value true, or until the end of the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  some<This = undefined>(
    predicate: (
      this: This,
      value: T,
      index: number,
      array: readonly T[]
    ) => boolean,
    thisArg?: This
  ): boolean;
  /**
   * Performs the specified action for each element in an array.
   * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
   * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  forEach<This = undefined>(
    callbackfn: (
      this: This,
      value: T,
      index: number,
      array: readonly T[]
    ) => void,
    thisArg?: This
  ): void;
  /**
   * Calls a defined callback function on each element of an array, and returns an array that contains the results.
   * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  map<U, This = undefined>(
    callbackfn: (this: This, value: T, index: number, array: readonly T[]) => U,
    thisArg?: This
  ): U[];
  /**
   * Returns the elements of an array that meet the condition specified in a callback function.
   * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
   */
  filter<S extends T, This = undefined>(
    predicate: (
      this: This,
      value: T,
      index: number,
      array: readonly T[]
    ) => value is S,
    thisArg?: This
  ): S[];
  /**
   * Returns the elements of an array that meet the condition specified in a callback function.
   * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
   */
  filter<This = undefined>(
    predicate: (
      this: This,
      value: T,
      index: number,
      array: readonly T[]
    ) => boolean,
    thisArg?: This
  ): T[];
}

interface Array<T> {
  /**
   * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
   * @param start The zero-based location in the array from which to start removing elements.
   * @param deleteCount The number of elements to remove.
   * @returns An array containing the elements that were deleted.
   */
  splice(start: number, deleteCount?: number): this;
  /**
   * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
   * @param start The zero-based location in the array from which to start removing elements.
   * @param deleteCount The number of elements to remove.
   * @param items Elements to insert into the array in place of the deleted elements.
   * @returns An array containing the elements that were deleted.
   */
  splice(start: number, deleteCount: number, ...items: T[]): this;
  /**
   * Determines whether all the members of an array satisfy the specified test.
   * @param predicate A function that accepts up to three arguments. The every method calls
   * the predicate function for each element in the array until the predicate returns a value
   * which is coercible to the Boolean value false, or until the end of the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  every<S extends T, This = undefined>(
    predicate: (this: This, value: T, index: number, array: T[]) => value is S,
    thisArg?: This
  ): this is S[];
  /**
   * Determines whether all the members of an array satisfy the specified test.
   * @param predicate A function that accepts up to three arguments. The every method calls
   * the predicate function for each element in the array until the predicate returns a value
   * which is coercible to the Boolean value false, or until the end of the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  every<This = undefined>(
    predicate: (this: This, value: T, index: number, array: T[]) => boolean,
    thisArg?: This
  ): boolean;
  /**
   * Determines whether the specified callback function returns true for any element of an array.
   * @param predicate A function that accepts up to three arguments. The some method calls
   * the predicate function for each element in the array until the predicate returns a value
   * which is coercible to the Boolean value true, or until the end of the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  some<This = undefined>(
    predicate: (this: This, value: T, index: number, array: T[]) => boolean,
    thisArg?: This
  ): boolean;
  /**
   * Performs the specified action for each element in an array.
   * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
   * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  forEach<This = undefined>(
    callbackfn: (this: This, value: T, index: number, array: T[]) => void,
    thisArg?: This
  ): void;
  /**
   * Calls a defined callback function on each element of an array, and returns an array that contains the results.
   * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  map<U, This = undefined>(
    callbackfn: (this: This, value: T, index: number, array: T[]) => U,
    thisArg?: This
  ): U[];
  /**
   * Returns the elements of an array that meet the condition specified in a callback function.
   * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
   */
  filter<S extends T, This = undefined>(
    predicate: (this: This, value: T, index: number, array: T[]) => value is S,
    thisArg?: This
  ): S[];
  /**
   * Returns the elements of an array that meet the condition specified in a callback function.
   * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
   */
  filter<This = undefined>(
    predicate: (this: This, value: T, index: number, array: T[]) => boolean,
    thisArg?: This
  ): T[];
}

interface ArrayConstructor {
  new <T>(arrayLength: number): T[];
  new <T>(...items: T[]): T[];
  <T>(arrayLength: number): T[];
  <T>(...items: T[]): T[];
  isArray(arg: any): arg is unknown[];
  readonly prototype: unknown[];
}

declare type PromiseConstructorLike = new <T>(
  executor: (
    resolve: undefined extends T
      ? {
          (value?: T | PromiseLike<T>): void;
        }
      : {
          (value: T | PromiseLike<T>): void;
        },
    reject: (reason?: any) => void
  ) => void
) => PromiseLike<T>;
