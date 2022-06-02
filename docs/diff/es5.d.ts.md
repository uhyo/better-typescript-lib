# es5.d.ts Diffs

```diff
Index: es5.d.ts
===================================================================
--- es5.d.ts
+++ es5.d.ts
@@ -1,4 +1,77 @@
+/// <reference no-default-lib="true"/>
+
+type First<T> = T extends [any] ? T[0] : unknown;
+
+type UnionToIntersection<T> = (
+  T extends any ? (arg: T) => void : never
+) extends (arg: infer F) => void
+  ? F
+  : unknown;
+
+type Reverse<T extends unknown[], U extends unknown[] = []> = T extends [
+  infer F,
+  ...infer R
+]
+  ? Reverse<R, [F, ...U]>
+  : T extends [...infer R, infer L]
+  ? [L, ...Reverse<R, U>]
+  : T extends unknown[]
+  ? [...T, ...U]
+  : U;
+
+type RangeArray<N extends number, A extends number[]> = A["length"] extends N
+  ? A
+  : RangeArray<N, [...A, A["length"]]>;
+
+type Indices<A extends readonly unknown[]> = number extends A["length"]
+  ? number
+  : RangeArray<A["length"], []> extends (infer A)[]
+  ? A
+  : never;
+
+type FilterMatch<T, U> = T extends Readonly<U> ? T : U extends T ? U | [] : [];
+
+type Filter<
+  T extends readonly unknown[],
+  S,
+  U extends unknown[] = []
+> = T extends readonly [infer F, ...infer R]
+  ? Filter<R, S, [...U, ...FilterMatch<[F], [S]>]>
+  : T extends readonly [...infer R, infer L]
+  ? [...Filter<R, S, U>, ...FilterMatch<[L], [S]>]
+  : [...U, ...FilterMatch<T, S[]>];
+
+type Cast<T, U> = T extends U ? T : U;
+
+type ValueIndexPairArray<
+  T extends readonly unknown[],
+  A extends unknown[] = []
+> = A["length"] extends T["length"]
+  ? A
+  : ValueIndexPairArray<
+      T,
+      [...A, [value: T[A["length"]], index: A["length"], array: T]]
+    >;
+
+type ValueIndexPair<A extends readonly T[], T> = Cast<
+  number extends A["length"]
+    ? unknown
+    : ValueIndexPairArray<A> extends (infer R)[]
+    ? R
+    : unknown,
+  [value: T, index: number, array: A]
+>;
+
+type JSONValue =
+  | null
+  | string
+  | number
+  | boolean
+  | {
+      [K in string]?: JSONValue;
+    }
+  | JSONValue[];
 /////////////////////////////
 /// ECMAScript APIs
 /////////////////////////////
 
@@ -8,9 +81,9 @@
 /**
  * Evaluates JavaScript code and executes it.
  * @param x A String value that contains valid JavaScript code.
  */
-declare function eval(x: string): any;
+declare function eval(x: string): unknown;
 
 /**
  * Converts a string to an integer.
  * @param string A string to convert into a number.
@@ -117,9 +190,19 @@
   /**
    * Determines whether an object has a property with the specified name.
    * @param v A property name.
    */
-  hasOwnProperty(v: PropertyKey): boolean;
+  hasOwnProperty<Key extends PropertyKey>(
+    v: Key
+  ): this is string extends Key
+    ? {}
+    : number extends Key
+    ? {}
+    : symbol extends Key
+    ? {}
+    : Key extends PropertyKey
+    ? { [key in Key]: unknown }
+    : {};
 
   /**
    * Determines whether an object exists in another object's prototype chain.
    * @param v Another object whose prototype chain is to be checked.
@@ -132,21 +215,26 @@
    */
   propertyIsEnumerable(v: PropertyKey): boolean;
 }
 
+/**
+ * Provides functionality common to all JavaScript objects.
+ */
+declare var Object: ObjectConstructor;
+
 interface ObjectConstructor {
   new (value?: any): Object;
-  (): any;
-  (value: any): any;
+  (): {};
+  <T>(value: T): T extends object ? T : {};
 
   /** A reference to the prototype for a class of objects. */
   readonly prototype: Object;
 
   /**
    * Returns the prototype of an object.
    * @param o The object that references the prototype.
    */
-  getPrototypeOf(o: any): any;
+  getPrototypeOf(o: any): unknown;
 
   /**
    * Gets the own property descriptor of the specified object.
    * An own property descriptor is one that is defined directly on the object and is not inherited from the object's prototype.
@@ -162,47 +250,101 @@
    * Returns the names of the own properties of an object. The own properties of an object are those that are defined directly
    * on that object, and are not inherited from the object's prototype. The properties of an object include both fields (objects) and functions.
    * @param o Object that contains the own properties.
    */
-  getOwnPropertyNames(o: any): string[];
+  getOwnPropertyNames<O>(o: O): O extends undefined | null ? never : string[];
 
   /**
    * Creates an object that has the specified prototype or that has null prototype.
    * @param o Object to use as a prototype. May be null.
    */
-  create(o: object | null): any;
+  create<O extends object>(o: O): O;
 
   /**
+   * Creates an object that has the specified prototype or that has null prototype.
+   * @param o Object to use as a prototype. May be null.
+   */
+  create(o: null): {};
+
+  /**
    * Creates an object that has the specified prototype, and that optionally contains specified properties.
    * @param o Object to use as a prototype. May be null
    * @param properties JavaScript object that contains one or more property descriptors.
    */
-  create(
-    o: object | null,
-    properties: PropertyDescriptorMap & ThisType<any>
-  ): any;
+  create<O extends object, P extends Record<PropertyKey, PropertyDescriptor>>(
+    o: O,
+    properties: P & ThisType<any>
+  ): {
+    [K in keyof (O & P)]: P[K] extends { value: infer V }
+      ? V
+      : P[K] extends { get: () => infer V }
+      ? V
+      : K extends keyof O
+      ? O[K]
+      : unknown;
+  };
 
   /**
+   * Creates an object that has the specified prototype, and that optionally contains specified properties.
+   * @param o Object to use as a prototype. May be null
+   * @param properties JavaScript object that contains one or more property descriptors.
+   */
+  create<P extends Record<string, PropertyDescriptor>>(
+    o: null,
+    properties: P & ThisType<any>
+  ): {
+    [K in keyof P]: P[K] extends { value: infer V }
+      ? V
+      : P[K] extends { get: () => infer V }
+      ? V
+      : unknown;
+  };
+
+  /**
    * Adds a property to an object, or modifies attributes of an existing property.
    * @param o Object on which to add or modify the property. This can be a native JavaScript object (that is, a user-defined object or a built in object) or a DOM object.
    * @param p The property name.
    * @param attributes Descriptor for the property. It can be for a data property or an accessor property.
    */
-  defineProperty<T>(
-    o: T,
-    p: PropertyKey,
-    attributes: PropertyDescriptor & ThisType<any>
-  ): T;
+  defineProperty<
+    O extends object,
+    P extends PropertyKey,
+    D extends PropertyDescriptor
+  >(
+    o: O,
+    p: P,
+    attributes: D & ThisType<any>
+  ): O &
+    (P extends PropertyKey // required to make P distributive
+      ? {
+          [K in P]: D extends { value: infer V }
+            ? V
+            : D extends { get: () => infer V }
+            ? V
+            : unknown;
+        }
+      : unknown);
 
   /**
    * Adds one or more properties to an object, and/or modifies attributes of existing properties.
    * @param o Object on which to add or modify the properties. This can be a native JavaScript object or a DOM object.
    * @param properties JavaScript object that contains one or more descriptor objects. Each descriptor object describes a data property or an accessor property.
    */
-  defineProperties<T>(
-    o: T,
-    properties: PropertyDescriptorMap & ThisType<any>
-  ): T;
+  defineProperties<
+    O extends object,
+    P extends Record<PropertyKey, PropertyDescriptor>
+  >(
+    o: O,
+    properties: P & ThisType<any>
+  ): {
+    [K in keyof (O & P)]: P[K] extends { value: infer V }
+      ? V
+      : P[K] extends { get: () => infer V }
+      ? V
+      : K extends keyof O
+      ? O[K]
+      : unknown;
+  };
 
   /**
    * Prevents the modification of attributes of existing properties, and prevents the addition of new properties.
    * @param o Object on which to lock the attributes.
@@ -210,17 +352,17 @@
   seal<T>(o: T): T;
 
   /**
    * Prevents the modification of existing property attributes and values, and prevents the addition of new properties.
-   * @param a Object on which to lock the attributes.
+   * @param o Object on which to lock the attributes.
    */
-  freeze<T>(a: T[]): readonly T[];
+  freeze<T>(o: T[]): readonly T[];
 
   /**
    * Prevents the modification of existing property attributes and values, and prevents the addition of new properties.
-   * @param f Object on which to lock the attributes.
+   * @param o Object on which to lock the attributes.
    */
-  freeze<T extends Function>(f: T): T;
+  freeze<T extends Function>(o: T): T;
 
   /**
    * Prevents the modification of existing property attributes and values, and prevents the addition of new properties.
    * @param o Object on which to lock the attributes.
@@ -258,13 +400,8 @@
   keys(o: object): string[];
 }
 
 /**
- * Provides functionality common to all JavaScript objects.
- */
-declare var Object: ObjectConstructor;
-
-/**
  * Creates a new function.
  */
 interface Function {
   /**
@@ -331,11 +468,16 @@
 interface CallableFunction extends Function {
   /**
    * Calls the function with the specified object as the this value and the elements of specified array as the arguments.
    * @param thisArg The object to be used as the this object.
+   */
+  apply<T, R>(this: (this: T) => R, thisArg: T): R;
+
+  /**
+   * Calls the function with the specified object as the this value and the elements of specified array as the arguments.
+   * @param thisArg The object to be used as the this object.
    * @param args An array of argument values to be passed to the function.
    */
-  apply<T, R>(this: (this: T) => R, thisArg: T): R;
   apply<T, A extends any[], R>(
     this: (this: T, ...args: A) => R,
     thisArg: T,
     args: A
@@ -357,49 +499,27 @@
    * The this object of the bound function is associated with the specified object, and has the specified initial parameters.
    * @param thisArg The object to be used as the this object.
    * @param args Arguments to bind to the parameters of the function.
    */
-  bind<T>(this: T, thisArg: ThisParameterType<T>): OmitThisParameter<T>;
-  bind<T, A0, A extends any[], R>(
-    this: (this: T, arg0: A0, ...args: A) => R,
+  bind<T, A extends readonly any[], B extends readonly any[], R>(
+    this: (this: T, ...args: [...A, ...B]) => R,
     thisArg: T,
-    arg0: A0
-  ): (...args: A) => R;
-  bind<T, A0, A1, A extends any[], R>(
-    this: (this: T, arg0: A0, arg1: A1, ...args: A) => R,
-    thisArg: T,
-    arg0: A0,
-    arg1: A1
-  ): (...args: A) => R;
-  bind<T, A0, A1, A2, A extends any[], R>(
-    this: (this: T, arg0: A0, arg1: A1, arg2: A2, ...args: A) => R,
-    thisArg: T,
-    arg0: A0,
-    arg1: A1,
-    arg2: A2
-  ): (...args: A) => R;
-  bind<T, A0, A1, A2, A3, A extends any[], R>(
-    this: (this: T, arg0: A0, arg1: A1, arg2: A2, arg3: A3, ...args: A) => R,
-    thisArg: T,
-    arg0: A0,
-    arg1: A1,
-    arg2: A2,
-    arg3: A3
-  ): (...args: A) => R;
-  bind<T, AX, R>(
-    this: (this: T, ...args: AX[]) => R,
-    thisArg: T,
-    ...args: AX[]
-  ): (...args: AX[]) => R;
+    ...args: A
+  ): (...args: B) => R;
 }
 
 interface NewableFunction extends Function {
   /**
    * Calls the function with the specified object as the this value and the elements of specified array as the arguments.
    * @param thisArg The object to be used as the this object.
+   */
+  apply<T>(this: new () => T, thisArg: T): void;
+
+  /**
+   * Calls the function with the specified object as the this value and the elements of specified array as the arguments.
+   * @param thisArg The object to be used as the this object.
    * @param args An array of argument values to be passed to the function.
    */
-  apply<T>(this: new () => T, thisArg: T): void;
   apply<T, A extends any[]>(
     this: new (...args: A) => T,
     thisArg: T,
     args: A
@@ -421,44 +541,17 @@
    * The this object of the bound function is associated with the specified object, and has the specified initial parameters.
    * @param thisArg The object to be used as the this object.
    * @param args Arguments to bind to the parameters of the function.
    */
-  bind<T>(this: T, thisArg: any): T;
-  bind<A0, A extends any[], R>(
-    this: new (arg0: A0, ...args: A) => R,
+  bind<A extends readonly any[], B extends readonly any[], R>(
+    this: new (...args: [...A, ...B]) => R,
     thisArg: any,
-    arg0: A0
-  ): new (...args: A) => R;
-  bind<A0, A1, A extends any[], R>(
-    this: new (arg0: A0, arg1: A1, ...args: A) => R,
-    thisArg: any,
-    arg0: A0,
-    arg1: A1
-  ): new (...args: A) => R;
-  bind<A0, A1, A2, A extends any[], R>(
-    this: new (arg0: A0, arg1: A1, arg2: A2, ...args: A) => R,
-    thisArg: any,
-    arg0: A0,
-    arg1: A1,
-    arg2: A2
-  ): new (...args: A) => R;
-  bind<A0, A1, A2, A3, A extends any[], R>(
-    this: new (arg0: A0, arg1: A1, arg2: A2, arg3: A3, ...args: A) => R,
-    thisArg: any,
-    arg0: A0,
-    arg1: A1,
-    arg2: A2,
-    arg3: A3
-  ): new (...args: A) => R;
-  bind<AX, R>(
-    this: new (...args: AX[]) => R,
-    thisArg: any,
-    ...args: AX[]
-  ): new (...args: AX[]) => R;
+    ...args: A
+  ): new (...args: B) => R;
 }
 
 interface IArguments {
-  [index: number]: any;
+  [index: number]: unknown;
   length: number;
   callee: Function;
 }
 
@@ -511,21 +604,26 @@
   match(regexp: string | RegExp): RegExpMatchArray | null;
 
   /**
    * Replaces text in a string, using a regular expression or search string.
-   * @param searchValue A string to search for.
+   * @param searchValue A string or RegExp search value.
    * @param replaceValue A string containing the text to replace for every successful match of searchValue in this string.
    */
   replace(searchValue: string | RegExp, replaceValue: string): string;
 
   /**
    * Replaces text in a string, using a regular expression or search string.
-   * @param searchValue A string to search for.
+   * @param searchValue A string or RegExp search value.
    * @param replacer A function that returns the replacement text.
    */
   replace(
     searchValue: string | RegExp,
-    replacer: (substring: string, ...args: any[]) => string
+    replacer: (
+      substring: string,
+      // TODO: could be improved, but blocked by issue:
+      // https://github.com/microsoft/TypeScript/issues/45972
+      ...rest: (string | number)[]
+    ) => string
   ): string;
 
   /**
    * Finds the first substring match in a regular expression search.
@@ -586,8 +684,24 @@
   /** Returns the primitive value of the specified object. */
   valueOf(): string;
 
   readonly [index: number]: string;
+
+  /////////////////////////////
+  /// ECMAScript Internationalization API
+  /////////////////////////////
+
+  /**
+   * Determines whether two strings are equivalent in the current or specified locale.
+   * @param that String to compare to target string
+   * @param locales A locale string or array of locale strings that contain one or more language or locale tags. If you include more than one locale string, list them in descending order of priority so that the first entry is the preferred locale. If you omit this parameter, the default locale of the JavaScript runtime is used. This parameter must conform to BCP 47 standards; see the Intl.Collator object for details.
+   * @param options An object that contains one or more properties that specify comparison options. see the Intl.Collator object for details.
+   */
+  localeCompare(
+    that: string,
+    locales?: string | string[],
+    options?: Intl.CollatorOptions
+  ): number;
 }
 
 interface StringConstructor {
   new (value?: any): String;
@@ -595,13 +709,8 @@
   readonly prototype: String;
   fromCharCode(...codes: number[]): string;
 }
 
-/**
- * Allows manipulation and formatting of text strings and determination and location of substrings within strings.
- */
-declare var String: StringConstructor;
-
 interface Boolean {
   /** Returns the primitive value of the specified object. */
   valueOf(): boolean;
 }
@@ -1187,43 +1296,81 @@
    * If a member contains nested objects, the nested objects are transformed before the parent object is.
    */
   parse(
     text: string,
-    reviver?: (this: any, key: string, value: any) => any
-  ): any;
+    reviver?: (this: JSONValue, key: string, value: JSONValue) => any
+  ): JSONValue;
   /**
    * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
    * @param value A JavaScript value, usually an object or array, to be converted.
    * @param replacer A function that transforms the results.
    * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
    */
+  stringify<T>(
+    value: T,
+    replacer?: (this: unknown, key: string, value: unknown) => any,
+    space?: string | number | null
+  ): T extends unknown
+    ? T extends
+        | undefined
+        | ((...args: any) => any)
+        | (new (...args: any) => any)
+        | symbol
+      ? undefined
+      : object extends T
+      ? string | undefined
+      : string
+    : never;
+  /**
+   * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
+   * @param value A JavaScript value, usually an object or array, to be converted.
+   * @param replacer A function that transforms the results.
+   * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
+   */
   stringify(
-    value: any,
-    replacer?: (this: any, key: string, value: any) => any,
-    space?: string | number
-  ): string;
+    value: unknown,
+    replacer?: (this: unknown, key: string, value: unknown) => any,
+    space?: string | number | null
+  ): string | undefined;
   /**
    * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
    * @param value A JavaScript value, usually an object or array, to be converted.
    * @param replacer An array of strings and numbers that acts as an approved list for selecting the object properties that will be stringified.
    * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
    */
+  stringify<T>(
+    value: T,
+    replacer?: (number | string)[] | null,
+    space?: string | number | null
+  ): T extends unknown
+    ? T extends
+        | undefined
+        | ((...args: any) => any)
+        | (new (...args: any) => any)
+        | symbol
+      ? undefined
+      : object extends T
+      ? string | undefined
+      : string
+    : never;
+  /**
+   * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
+   * @param value A JavaScript value, usually an object or array, to be converted.
+   * @param replacer An array of strings and numbers that acts as an approved list for selecting the object properties that will be stringified.
+   * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
+   */
   stringify(
-    value: any,
+    value: unknown,
     replacer?: (number | string)[] | null,
-    space?: string | number
-  ): string;
+    space?: string | number | null
+  ): string | undefined;
 }
 
 /**
  * An intrinsic object that provides functions to convert JavaScript values to and from the JavaScript Object Notation (JSON) format.
  */
 declare var JSON: JSON;
 
-/////////////////////////////
-/// ECMAScript Array API (specially handled by compiler)
-/////////////////////////////
-
 interface ReadonlyArray<T> {
   /**
    * Gets the length of the array. This is a number one higher than the highest element defined in an array.
    */
@@ -1261,38 +1408,43 @@
    * Returns the index of the first occurrence of a value in an array.
    * @param searchElement The value to locate in the array.
    * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
    */
-  indexOf(searchElement: T, fromIndex?: number): number;
+  indexOf(searchElement: T, fromIndex?: number): -1 | Indices<this>;
   /**
    * Returns the index of the last occurrence of a specified value in an array.
    * @param searchElement The value to locate in the array.
    * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at the last index in the array.
    */
-  lastIndexOf(searchElement: T, fromIndex?: number): number;
+  lastIndexOf(searchElement: T, fromIndex?: number): -1 | Indices<this>;
   /**
    * Determines whether all the members of an array satisfy the specified test.
    * @param predicate A function that accepts up to three arguments. The every method calls
    * the predicate function for each element in the array until the predicate returns a value
    * which is coercible to the Boolean value false, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  every<S extends T>(
-    predicate: (value: T, index: number, array: readonly T[]) => value is S,
-    thisArg?: any
-  ): this is readonly S[];
+  every<S extends T, This = undefined>(
+    predicate: (
+      this: This,
+      value: T,
+      index: Indices<this>,
+      array: this
+    ) => value is S,
+    thisArg?: This
+  ): this is { [K in keyof this]: S };
   /**
    * Determines whether all the members of an array satisfy the specified test.
    * @param predicate A function that accepts up to three arguments. The every method calls
    * the predicate function for each element in the array until the predicate returns a value
    * which is coercible to the Boolean value false, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  every(
-    predicate: (value: T, index: number, array: readonly T[]) => unknown,
-    thisArg?: any
+  every<This = undefined>(
+    predicate: (this: This, ...args: ValueIndexPair<this, T>) => boolean,
+    thisArg?: This
   ): boolean;
   /**
    * Determines whether the specified callback function returns true for any element of an array.
    * @param predicate A function that accepts up to three arguments. The some method calls
@@ -1300,118 +1452,85 @@
    * which is coercible to the Boolean value true, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  some(
-    predicate: (value: T, index: number, array: readonly T[]) => unknown,
-    thisArg?: any
+  some<This = undefined>(
+    predicate: (this: This, ...args: ValueIndexPair<this, T>) => boolean,
+    thisArg?: This
   ): boolean;
   /**
    * Performs the specified action for each element in an array.
    * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
    * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
    */
-  forEach(
-    callbackfn: (value: T, index: number, array: readonly T[]) => void,
-    thisArg?: any
+  forEach<This = undefined>(
+    callbackfn: (this: This, ...args: ValueIndexPair<this, T>) => void,
+    thisArg?: This
   ): void;
   /**
    * Calls a defined callback function on each element of an array, and returns an array that contains the results.
    * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
    */
-  map<U>(
-    callbackfn: (value: T, index: number, array: readonly T[]) => U,
-    thisArg?: any
-  ): U[];
+  map<U, This = undefined>(
+    callbackfn: (this: This, ...args: ValueIndexPair<this, T>) => U,
+    thisArg?: This
+  ): { -readonly [K in keyof this]: U };
   /**
    * Returns the elements of an array that meet the condition specified in a callback function.
    * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
    */
-  filter<S extends T>(
-    predicate: (value: T, index: number, array: readonly T[]) => value is S,
-    thisArg?: any
-  ): S[];
+  filter<S extends T, This = undefined>(
+    predicate: (
+      this: This,
+      value: T,
+      index: Indices<this>,
+      array: this
+    ) => value is S,
+    thisArg?: This
+  ): Filter<this, S>;
   /**
    * Returns the elements of an array that meet the condition specified in a callback function.
    * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
    */
-  filter(
-    predicate: (value: T, index: number, array: readonly T[]) => unknown,
-    thisArg?: any
+  filter<This = undefined>(
+    predicate: (this: This, ...args: ValueIndexPair<this, T>) => boolean,
+    thisArg?: This
   ): T[];
   /**
    * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
    * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
    */
-  reduce(
-    callbackfn: (
-      previousValue: T,
-      currentValue: T,
-      currentIndex: number,
-      array: readonly T[]
-    ) => T
-  ): T;
-  reduce(
-    callbackfn: (
-      previousValue: T,
-      currentValue: T,
-      currentIndex: number,
-      array: readonly T[]
-    ) => T,
-    initialValue: T
-  ): T;
+  reduce<U = T>(
+    callbackfn: (previousValue: T | U, ...args: ValueIndexPair<this, T>) => U
+  ): U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
    * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
    */
-  reduce<U>(
-    callbackfn: (
-      previousValue: U,
-      currentValue: T,
-      currentIndex: number,
-      array: readonly T[]
-    ) => U,
+  reduce<U = T>(
+    callbackfn: (previousValue: U, ...args: ValueIndexPair<this, T>) => U,
     initialValue: U
   ): U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
    * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
    */
-  reduceRight(
-    callbackfn: (
-      previousValue: T,
-      currentValue: T,
-      currentIndex: number,
-      array: readonly T[]
-    ) => T
-  ): T;
-  reduceRight(
-    callbackfn: (
-      previousValue: T,
-      currentValue: T,
-      currentIndex: number,
-      array: readonly T[]
-    ) => T,
-    initialValue: T
-  ): T;
+  reduceRight<U = T>(
+    callbackfn: (previousValue: T | U, ...args: ValueIndexPair<this, T>) => U
+  ): U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
    * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
    */
-  reduceRight<U>(
-    callbackfn: (
-      previousValue: U,
-      currentValue: T,
-      currentIndex: number,
-      array: readonly T[]
-    ) => U,
+  reduceRight<U = T>(
+    callbackfn: (previousValue: U, ...args: ValueIndexPair<this, T>) => U,
     initialValue: U
   ): U;
 
   readonly [n: number]: T;
@@ -1467,9 +1586,9 @@
   /**
    * Reverses the elements in an array in place.
    * This method mutates the array and returns a reference to the same array.
    */
-  reverse(): T[];
+  reverse(): Reverse<this>;
   /**
    * Removes the first element from an array and returns it.
    * If the array is empty, undefined is returned and the array is not modified.
    */
@@ -1493,9 +1612,9 @@
    * ```ts
    * [11,2,22,1].sort((a, b) => a - b)
    * ```
    */
-  sort(compareFn?: (a: T, b: T) => number): this;
+  sort(compareFn?: (a: T, b: T) => number): T[];
   /**
    * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
    * @param start The zero-based location in the array from which to start removing elements.
    * @param deleteCount The number of elements to remove.
@@ -1517,40 +1636,43 @@
   unshift(...items: T[]): number;
   /**
    * Returns the index of the first occurrence of a value in an array, or -1 if it is not present.
    * @param searchElement The value to locate in the array.
-   * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
    */
-  indexOf(searchElement: T, fromIndex?: number): number;
+  indexOf(searchElement: T, fromIndex?: number): -1 | Indices<this>;
   /**
    * Returns the index of the last occurrence of a specified value in an array, or -1 if it is not present.
    * @param searchElement The value to locate in the array.
-   * @param fromIndex The array index at which to begin searching backward. If fromIndex is omitted, the search starts at the last index in the array.
    */
-  lastIndexOf(searchElement: T, fromIndex?: number): number;
+  lastIndexOf(searchElement: T, fromIndex?: number): -1 | Indices<this>;
   /**
    * Determines whether all the members of an array satisfy the specified test.
    * @param predicate A function that accepts up to three arguments. The every method calls
    * the predicate function for each element in the array until the predicate returns a value
    * which is coercible to the Boolean value false, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  every<S extends T>(
-    predicate: (value: T, index: number, array: T[]) => value is S,
-    thisArg?: any
-  ): this is S[];
+  every<S extends T, This = undefined>(
+    predicate: (
+      this: This,
+      value: T,
+      index: Indices<this>,
+      array: this
+    ) => value is S,
+    thisArg?: This
+  ): this is { [K in keyof this]: S };
   /**
    * Determines whether all the members of an array satisfy the specified test.
    * @param predicate A function that accepts up to three arguments. The every method calls
    * the predicate function for each element in the array until the predicate returns a value
    * which is coercible to the Boolean value false, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  every(
-    predicate: (value: T, index: number, array: T[]) => unknown,
-    thisArg?: any
+  every<This = undefined>(
+    predicate: (this: This, ...args: ValueIndexPair<this, T>) => boolean,
+    thisArg?: This
   ): boolean;
   /**
    * Determines whether the specified callback function returns true for any element of an array.
    * @param predicate A function that accepts up to three arguments. The some method calls
@@ -1558,137 +1680,100 @@
    * which is coercible to the Boolean value true, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  some(
-    predicate: (value: T, index: number, array: T[]) => unknown,
-    thisArg?: any
+  some<This = undefined>(
+    predicate: (this: This, ...args: ValueIndexPair<this, T>) => boolean,
+    thisArg?: This
   ): boolean;
   /**
    * Performs the specified action for each element in an array.
    * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
    * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
    */
-  forEach(
-    callbackfn: (value: T, index: number, array: T[]) => void,
-    thisArg?: any
+  forEach<This = undefined>(
+    callbackfn: (this: This, ...args: ValueIndexPair<this, T>) => void,
+    thisArg?: This
   ): void;
   /**
    * Calls a defined callback function on each element of an array, and returns an array that contains the results.
    * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
    */
-  map<U>(
-    callbackfn: (value: T, index: number, array: T[]) => U,
-    thisArg?: any
-  ): U[];
+  map<U, This = undefined>(
+    callbackfn: (this: This, ...args: ValueIndexPair<this, T>) => U,
+    thisArg?: This
+  ): { [K in keyof this]: U };
   /**
    * Returns the elements of an array that meet the condition specified in a callback function.
    * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
    */
-  filter<S extends T>(
-    predicate: (value: T, index: number, array: T[]) => value is S,
-    thisArg?: any
-  ): S[];
+  filter<S extends T, This = undefined>(
+    predicate: (
+      this: This,
+      value: T,
+      index: Indices<this>,
+      array: this
+    ) => value is S,
+    thisArg?: This
+  ): Filter<this, S>;
   /**
    * Returns the elements of an array that meet the condition specified in a callback function.
    * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
    */
-  filter(
-    predicate: (value: T, index: number, array: T[]) => unknown,
-    thisArg?: any
+  filter<This = undefined>(
+    predicate: (this: This, ...args: ValueIndexPair<this, T>) => boolean,
+    thisArg?: This
   ): T[];
   /**
    * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
-   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
    */
-  reduce(
-    callbackfn: (
-      previousValue: T,
-      currentValue: T,
-      currentIndex: number,
-      array: T[]
-    ) => T
-  ): T;
-  reduce(
-    callbackfn: (
-      previousValue: T,
-      currentValue: T,
-      currentIndex: number,
-      array: T[]
-    ) => T,
-    initialValue: T
-  ): T;
+  reduce<U = T>(
+    callbackfn: (previousValue: T | U, ...args: ValueIndexPair<this, T>) => U
+  ): U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
    * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
    */
-  reduce<U>(
-    callbackfn: (
-      previousValue: U,
-      currentValue: T,
-      currentIndex: number,
-      array: T[]
-    ) => U,
+  reduce<U = T>(
+    callbackfn: (previousValue: U, ...args: ValueIndexPair<this, T>) => U,
     initialValue: U
   ): U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
-   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
    */
-  reduceRight(
-    callbackfn: (
-      previousValue: T,
-      currentValue: T,
-      currentIndex: number,
-      array: T[]
-    ) => T
-  ): T;
-  reduceRight(
-    callbackfn: (
-      previousValue: T,
-      currentValue: T,
-      currentIndex: number,
-      array: T[]
-    ) => T,
-    initialValue: T
-  ): T;
+  reduceRight<U = T>(
+    callbackfn: (previousValue: T | U, ...args: ValueIndexPair<this, T>) => U
+  ): U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
    * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
    */
-  reduceRight<U>(
-    callbackfn: (
-      previousValue: U,
-      currentValue: T,
-      currentIndex: number,
-      array: T[]
-    ) => U,
+  reduceRight<U = T>(
+    callbackfn: (previousValue: U, ...args: ValueIndexPair<this, T>) => U,
     initialValue: U
   ): U;
 
   [n: number]: T;
 }
 
+declare var Array: ArrayConstructor;
+
 interface ArrayConstructor {
-  new (arrayLength?: number): any[];
   new <T>(arrayLength: number): T[];
   new <T>(...items: T[]): T[];
-  (arrayLength?: number): any[];
   <T>(arrayLength: number): T[];
   <T>(...items: T[]): T[];
-  isArray(arg: any): arg is any[];
-  readonly prototype: any[];
+  isArray(arg: any): arg is unknown[];
+  readonly prototype: unknown[];
 }
 
-declare var Array: ArrayConstructor;
-
 interface TypedPropertyDescriptor<T> {
   enumerable?: boolean;
   configurable?: boolean;
   writable?: boolean;
@@ -1716,9 +1801,15 @@
 ) => void;
 
 declare type PromiseConstructorLike = new <T>(
   executor: (
-    resolve: (value: T | PromiseLike<T>) => void,
+    resolve: undefined extends T
+      ? {
+          (value?: T | PromiseLike<T>): void;
+        }
+      : {
+          (value: T | PromiseLike<T>): void;
+        },
     reject: (reason?: any) => void
   ) => void
 ) => PromiseLike<T>;
 
@@ -5435,22 +5526,8 @@
     ): string[];
   };
 }
 
-interface String {
-  /**
-   * Determines whether two strings are equivalent in the current or specified locale.
-   * @param that String to compare to target string
-   * @param locales A locale string or array of locale strings that contain one or more language or locale tags. If you include more than one locale string, list them in descending order of priority so that the first entry is the preferred locale. If you omit this parameter, the default locale of the JavaScript runtime is used. This parameter must conform to BCP 47 standards; see the Intl.Collator object for details.
-   * @param options An object that contains one or more properties that specify comparison options. see the Intl.Collator object for details.
-   */
-  localeCompare(
-    that: string,
-    locales?: string | string[],
-    options?: Intl.CollatorOptions
-  ): number;
-}
-
 interface Number {
   /**
    * Converts a number to a string by using the current or specified locale.
    * @param locales A locale string or array of locale strings that contain one or more language or locale tags. If you include more than one locale string, list them in descending order of priority so that the first entry is the preferred locale. If you omit this parameter, the default locale of the JavaScript runtime is used.

```
