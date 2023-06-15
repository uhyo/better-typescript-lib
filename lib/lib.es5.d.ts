type Cast<T, U> = T extends U ? T : U;

/**
 * Make all properties in T writable
 */
type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

type Intersect<T extends readonly any[]> = ((
  ...args: { [K in keyof T]: Cast<Writable<T[K]>, {}> }
) => void) extends (...args: { [K in keyof T]: infer S }) => void
  ? S
  : never;

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
  hasOwnProperty<Obj, Key extends PropertyKey>(
    this: Obj,
    v: Key
  ): this is Obj &
    (string extends Key
      ? {}
      : number extends Key
      ? {}
      : symbol extends Key
      ? {}
      : Key extends PropertyKey
      ? { [key in Key]: unknown }
      : {});
}

interface ObjectConstructor {
  new (value?: any): Object;
  (): {};
  <T>(value: T): T extends object ? T : {};

  /**
   * Returns the prototype of an object.
   * @param o The object that references the prototype.
   */
  getPrototypeOf(o: {}): unknown;

  /**
   * Gets the own property descriptor of the specified object.
   * An own property descriptor is one that is defined directly on the object and is not inherited from the object's prototype.
   * @param o Object that contains the property.
   * @param p Name of the property.
   */
  getOwnPropertyDescriptor(
    o: {},
    p: PropertyKey
  ): PropertyDescriptor | undefined;

  /**
   * Returns the names of the own properties of an object. The own properties of an object are those that are defined directly
   * on that object, and are not inherited from the object's prototype. The properties of an object include both fields (objects) and functions.
   * @param o Object that contains the own properties.
   */
  getOwnPropertyNames(o: {}): string[];

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
   */
  bind<T>(this: T, thisArg: ThisParameterType<T>): OmitThisParameter<T>;

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
   * For a given function, creates a bound function that has the same body as the original function.
   * The this object of the bound function is associated with the specified object, and has the specified initial parameters.
   * @param thisArg The object to be used as the this object.
   */
  bind<T>(this: T, thisArg: any): T;

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

type JSONPrimitive = string | number | boolean | null;
type JSONComposite<A> = Record<string, A> | A[];
type JSONValueF<A> = JSONPrimitive | JSONComposite<A>;
type JSONValue = JSONPrimitive | JSONObject | JSONValue[];
type JSONObject = { [key: string]: JSONValue };
type JSONHolder<K extends string, A> = Record<K, JSONValueF<A>>;
type ToJSON<A> = A extends { toJSON(...args: any): infer T } ? T : A;
type SomeExtends<A, B> = A extends B ? undefined : never;
type SomeFunction = (...args: any) => any;
type SomeConstructor = new (...args: any) => any;
type UndefinedDomain = symbol | SomeFunction | SomeConstructor | undefined;
type StringifyResultT<A> = A extends UndefinedDomain ? undefined : string;
type StringifyResult<A> = StringifyResultT<A> | SomeExtends<UndefinedDomain, A>;

interface JSON {
  /**
   * Converts a JavaScript Object Notation (JSON) string into an object.
   * @param text A valid JSON string.
   */
  parse(text: string): JSONValue;
  /**
   * Converts a JavaScript Object Notation (JSON) string into an object.
   * @param text A valid JSON string.
   * @param reviver A function that transforms the results. This function is called for each member of the object.
   * If a member contains nested objects, the nested objects are transformed before the parent object is.
   */
  parse<A = unknown>(
    text: string,
    reviver: <K extends string>(
      this: JSONHolder<K, A>,
      key: K,
      value: JSONValueF<A>
    ) => A
  ): A;
  /**
   * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
   * @param value A JavaScript value, usually an object or array, to be converted.
   * @param replacer An array of strings and numbers that acts as an approved list for selecting the object properties that will be stringified.
   * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
   */
  stringify<A>(
    value: A,
    replacer?: (string | number)[] | null | undefined,
    space?: string | number | null | undefined
  ): StringifyResult<ToJSON<A>>;
  /**
   * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
   * @param value A JavaScript value, usually an object or array, to be converted.
   * @param replacer A function that transforms the results.
   * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
   */
  stringify<A>(
    value: A,
    replacer: (
      this: JSONComposite<A>,
      key: string,
      value: ToJSON<A>
    ) => JSONValueF<A>,
    space?: string | number | null | undefined
  ): string;
  /**
   * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
   * @param value A JavaScript value, usually an object or array, to be converted.
   * @param replacer A function that transforms the results.
   * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
   */
  stringify<A>(
    value: A,
    replacer: (
      this: JSONComposite<A>,
      key: string,
      value: ToJSON<A>
    ) => JSONValueF<A> | undefined,
    space?: string | number | null | undefined
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
    predicate: (this: This, value: T, index: number, array: this) => value is S,
    thisArg?: This
  ): this is { [K in keyof this]: S };
  /**
   * Determines whether all the members of an array satisfy the specified test.
   * @param predicate A function that accepts up to three arguments. The every method calls
   * the predicate function for each element in the array until the predicate returns a value
   * which is coercible to the Boolean value false, or until the end of the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  every<This = undefined>(
    predicate: (this: This, value: T, index: number, array: this) => boolean,
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
    predicate: (this: This, value: T, index: number, array: this) => boolean,
    thisArg?: This
  ): boolean;
  /**
   * Performs the specified action for each element in an array.
   * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
   * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  forEach<This = undefined>(
    callbackfn: (this: This, value: T, index: number, array: this) => void,
    thisArg?: This
  ): void;
  /**
   * Calls a defined callback function on each element of an array, and returns an array that contains the results.
   * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  map<U, This = undefined>(
    callbackfn: (this: This, value: T, index: number, array: this) => U,
    thisArg?: This
  ): { -readonly [K in keyof this]: U };
  /**
   * Returns the elements of an array that meet the condition specified in a callback function.
   * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
   */
  filter<S extends T, This = undefined>(
    predicate: (this: This, value: T, index: number, array: this) => value is S,
    thisArg?: This
  ): S[];
  /**
   * Returns the elements of an array that meet the condition specified in a callback function.
   * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
   */
  filter<This = undefined>(
    predicate: (this: This, value: T, index: number, array: this) => boolean,
    thisArg?: This
  ): T[];
  /**
   * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
   */
  reduce<U = T>(
    callbackfn: (
      previousValue: T | U,
      currentValue: T,
      currentIndex: number,
      array: this
    ) => U
  ): T | U;
  /**
   * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
   */
  reduce<U = T>(
    callbackfn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: this
    ) => U,
    initialValue: U
  ): U;
  /**
   * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
   */
  reduceRight<U = T>(
    callbackfn: (
      previousValue: T | U,
      currentValue: T,
      currentIndex: number,
      array: this
    ) => U
  ): T | U;
  /**
   * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
   */
  reduceRight<U = T>(
    callbackfn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: this
    ) => U,
    initialValue: U
  ): U;
}

interface Array<T> {
  /**
   * Determines whether all the members of an array satisfy the specified test.
   * @param predicate A function that accepts up to three arguments. The every method calls
   * the predicate function for each element in the array until the predicate returns a value
   * which is coercible to the Boolean value false, or until the end of the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  every<S extends T, This = undefined>(
    predicate: (this: This, value: T, index: number, array: this) => value is S,
    thisArg?: This
  ): this is { [K in keyof this]: S };
  /**
   * Determines whether all the members of an array satisfy the specified test.
   * @param predicate A function that accepts up to three arguments. The every method calls
   * the predicate function for each element in the array until the predicate returns a value
   * which is coercible to the Boolean value false, or until the end of the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  every<This = undefined>(
    predicate: (this: This, value: T, index: number, array: this) => boolean,
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
    predicate: (this: This, value: T, index: number, array: this) => boolean,
    thisArg?: This
  ): boolean;
  /**
   * Performs the specified action for each element in an array.
   * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
   * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  forEach<This = undefined>(
    callbackfn: (this: This, value: T, index: number, array: this) => void,
    thisArg?: This
  ): void;
  /**
   * Calls a defined callback function on each element of an array, and returns an array that contains the results.
   * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  map<U, This = undefined>(
    callbackfn: (this: This, value: T, index: number, array: this) => U,
    thisArg?: This
  ): { [K in keyof this]: U };
  /**
   * Returns the elements of an array that meet the condition specified in a callback function.
   * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
   */
  filter<S extends T, This = undefined>(
    predicate: (this: This, value: T, index: number, array: this) => value is S,
    thisArg?: This
  ): S[];
  /**
   * Returns the elements of an array that meet the condition specified in a callback function.
   * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
   */
  filter<This = undefined>(
    predicate: (this: This, value: T, index: number, array: this) => boolean,
    thisArg?: This
  ): T[];
  /**
   * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
   */
  reduce<U = T>(
    callbackfn: (
      previousValue: T | U,
      currentValue: T,
      currentIndex: number,
      array: this
    ) => U
  ): T | U;
  /**
   * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
   */
  reduce<U = T>(
    callbackfn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: this
    ) => U,
    initialValue: U
  ): U;
  /**
   * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
   */
  reduceRight<U = T>(
    callbackfn: (
      previousValue: T | U,
      currentValue: T,
      currentIndex: number,
      array: this
    ) => U
  ): T | U;
  /**
   * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
   */
  reduceRight<U = T>(
    callbackfn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: this
    ) => U,
    initialValue: U
  ): U;
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
      ? (value?: T | PromiseLike<T>) => void
      : (value: T | PromiseLike<T>) => void,
    reject: (reason?: any) => void
  ) => void
) => PromiseLike<T>;

interface PromiseLike<T> {
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then(
    onfulfilled?: null | undefined,
    onrejected?: ((reason: unknown) => T | PromiseLike<T>) | null | undefined
  ): PromiseLike<T>;

  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<U>(
    onfulfilled: (value: T) => U | PromiseLike<U>,
    onrejected?: ((reason: unknown) => U | PromiseLike<U>) | null | undefined
  ): PromiseLike<U>;
}

interface Promise<T> extends PromiseLike<T> {
  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then(
    onfulfilled?: null | undefined,
    onrejected?: ((reason: unknown) => T | PromiseLike<T>) | null | undefined
  ): Promise<T>;

  /**
   * Attaches callbacks for the resolution and/or rejection of the Promise.
   * @param onfulfilled The callback to execute when the Promise is resolved.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of which ever callback is executed.
   */
  then<U, R = never>(
    onfulfilled: (value: T) => U | PromiseLike<U>,
    onrejected?: ((reason: unknown) => R | PromiseLike<R>) | null | undefined
  ): Promise<U | R>;

  /**
   * Attaches a callback for only the rejection of the Promise.
   * @param onrejected The callback to execute when the Promise is rejected.
   * @returns A Promise for the completion of the callback.
   */
  catch<U>(
    onrejected: (reason: unknown) => U | PromiseLike<U>
  ): Promise<T | U>;
}

interface TypedNumberArray {
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
      value: number,
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
      value: number,
      index: number,
      array: this
    ) => boolean,
    thisArg?: This
  ): TypedNumberArray;
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
    predicate: (this: This, value: number, index: number, obj: this) => boolean,
    thisArg?: This
  ): number | undefined;
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
    predicate: (this: This, value: number, index: number, obj: this) => boolean,
    thisArg?: This
  ): number;
  /**
   * Performs the specified action for each element in an array.
   * @param callbackfn  A function that accepts up to three arguments. forEach calls the
   * callbackfn function one time for each element in the array.
   * @param thisArg  An object to which the this keyword can refer in the callbackfn function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  forEach<This = undefined>(
    callbackfn: (this: This, value: number, index: number, array: this) => void,
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
      value: number,
      index: number,
      array: this
    ) => number,
    thisArg?: This
  ): TypedNumberArray;
  /**
   * Calls the specified callback function for all the elements in an array. The return value of
   * the callback function is the accumulated result, and is provided as an argument in the next
   * call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
   * callbackfn function one time for each element in the array.
   */
  reduce<U = number>(
    callbackfn: (
      previousValue: number | U,
      currentValue: number,
      currentIndex: number,
      array: this
    ) => U
  ): number | U;
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
  reduce<U = number>(
    callbackfn: (
      previousValue: U,
      currentValue: number,
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
  reduceRight<U = number>(
    callbackfn: (
      previousValue: number | U,
      currentValue: number,
      currentIndex: number,
      array: this
    ) => U
  ): number | U;
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
  reduceRight<U = number>(
    callbackfn: (
      previousValue: U,
      currentValue: number,
      currentIndex: number,
      array: this
    ) => U,
    initialValue: U
  ): U;
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
      value: number,
      index: number,
      array: this
    ) => boolean,
    thisArg?: This
  ): boolean;
}

interface TypedNumberArrayConstructor {
  /**
   * Creates an array from an array-like or iterable object.
   * @param arrayLike An array-like or iterable object to convert to an array.
   */
  from(arrayLike: ArrayLike<number>): TypedNumberArray;
  /**
   * Creates an array from an array-like or iterable object.
   * @param arrayLike An array-like or iterable object to convert to an array.
   * @param mapfn A mapping function to call on every element of the array.
   * @param thisArg Value of 'this' used to invoke the mapfn.
   */
  from<T, This = undefined>(
    arrayLike: ArrayLike<T>,
    mapfn: (this: This, v: T, k: number) => number,
    thisArg?: This
  ): TypedNumberArray;
}
