# es5.d.ts Diffs

```diff
Index: es5.d.ts
===================================================================
--- es5.d.ts
+++ es5.d.ts
@@ -8,9 +8,9 @@
 /**
  * Evaluates JavaScript code and executes it.
  * @param x A String value that contains valid JavaScript code.
  */
-declare function eval(x: string): any;
+declare function eval(x: string): unknown;
 
 /**
  * Converts a string to an integer.
  * @param string A string to convert into a number.
@@ -99,9 +99,8 @@
 
 interface PropertyDescriptorMap {
   [key: PropertyKey]: PropertyDescriptor;
 }
-
 interface Object {
   /** The initial value of Object.prototype.constructor is the standard built-in Object constructor. */
   constructor: Function;
 
@@ -112,14 +111,25 @@
   toLocaleString(): string;
 
   /** Returns the primitive value of the specified object. */
   valueOf(): Object;
-
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
+    ? {
+        [key in Key]: unknown;
+      }
+    : {};
 
   /**
    * Determines whether an object exists in another object's prototype chain.
    * @param v Another object whose prototype chain is to be checked.
@@ -131,78 +141,147 @@
    * @param v A property name.
    */
   propertyIsEnumerable(v: PropertyKey): boolean;
 }
-
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
+  getPrototypeOf<T>(o: T): CheckNonNullable<T, unknown>;
 
   /**
    * Gets the own property descriptor of the specified object.
    * An own property descriptor is one that is defined directly on the object and is not inherited from the object's prototype.
    * @param o Object that contains the property.
    * @param p Name of the property.
    */
-  getOwnPropertyDescriptor(
-    o: any,
+  getOwnPropertyDescriptor<T>(
+    o: T,
     p: PropertyKey
-  ): PropertyDescriptor | undefined;
+  ): CheckNonNullable<T, PropertyDescriptor | undefined>;
 
   /**
    * Returns the names of the own properties of an object. The own properties of an object are those that are defined directly
    * on that object, and are not inherited from the object's prototype. The properties of an object include both fields (objects) and functions.
    * @param o Object that contains the own properties.
    */
-  getOwnPropertyNames(o: any): string[];
+  getOwnPropertyNames<T>(o: T): CheckNonNullable<T, string[]>;
 
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
+    [K in keyof (O & P)]: P[K] extends {
+      value: infer V;
+    }
+      ? V
+      : P[K] extends {
+          get: () => infer V;
+        }
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
+    [K in keyof P]: P[K] extends {
+      value: infer V;
+    }
+      ? V
+      : P[K] extends {
+          get: () => infer V;
+        }
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
+          [K in P]: D extends {
+            value: infer V;
+          }
+            ? V
+            : D extends {
+                get: () => infer V;
+              }
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
+    [K in keyof (O & P)]: P[K] extends {
+      value: infer V;
+    }
+      ? V
+      : P[K] extends {
+          get: () => infer V;
+        }
+      ? V
+      : K extends keyof O
+      ? O[K]
+      : unknown;
+  };
 
   /**
    * Prevents the modification of attributes of existing properties, and prevents the addition of new properties.
    * @param o Object on which to lock the attributes.
@@ -326,9 +405,8 @@
   ? T
   : T extends (...args: infer A) => infer R
   ? (...args: A) => R
   : T;
-
 interface CallableFunction extends Function {
   /**
    * Calls the function with the specified object as the this value and the elements of specified array as the arguments.
    * @param thisArg The object to be used as the this object.
@@ -350,49 +428,20 @@
     this: (this: T, ...args: A) => R,
     thisArg: T,
     ...args: A
   ): R;
-
   /**
    * For a given function, creates a bound function that has the same body as the original function.
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
-
 interface NewableFunction extends Function {
   /**
    * Calls the function with the specified object as the this value and the elements of specified array as the arguments.
    * @param thisArg The object to be used as the this object.
@@ -414,55 +463,25 @@
     this: new (...args: A) => T,
     thisArg: T,
     ...args: A
   ): void;
-
   /**
    * For a given function, creates a bound function that has the same body as the original function.
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
-
 interface IArguments {
-  [index: number]: any;
+  [index: number]: unknown;
   length: number;
   callee: Function;
 }
-
 interface String {
   /** Returns a string representation of a string. */
   toString(): string;
 
@@ -508,24 +527,28 @@
    * Matches a string with a regular expression, and returns an array containing the results of that search.
    * @param regexp A variable name or string literal containing the regular expression pattern and flags.
    */
   match(regexp: string | RegExp): RegExpMatchArray | null;
-
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
@@ -1177,9 +1200,8 @@
   readonly prototype: URIError;
 }
 
 declare var URIError: URIErrorConstructor;
-
 interface JSON {
   /**
    * Converts a JavaScript Object Notation (JSON) string into an object.
    * @param text A valid JSON string.
@@ -1187,43 +1209,80 @@
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
-
-/////////////////////////////
-/// ECMAScript Array API (specially handled by compiler)
-/////////////////////////////
-
 interface ReadonlyArray<T> {
   /**
    * Gets the length of the array. This is a number one higher than the highest element defined in an array.
    */
@@ -1276,23 +1335,25 @@
    * which is coercible to the Boolean value false, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  every<S extends T>(
-    predicate: (value: T, index: number, array: readonly T[]) => value is S,
-    thisArg?: any
-  ): this is readonly S[];
+  every<S extends T, This = undefined>(
+    predicate: (this: This, value: T, index: number, array: this) => value is S,
+    thisArg?: This
+  ): this is {
+    [K in keyof this]: S;
+  };
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
+    predicate: (this: This, value: T, index: number, array: this) => boolean,
+    thisArg?: This
   ): boolean;
   /**
    * Determines whether the specified callback function returns true for any element of an array.
    * @param predicate A function that accepts up to three arguments. The some method calls
@@ -1300,117 +1361,99 @@
    * which is coercible to the Boolean value true, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  some(
-    predicate: (value: T, index: number, array: readonly T[]) => unknown,
-    thisArg?: any
+  some<This = undefined>(
+    predicate: (this: This, value: T, index: number, array: this) => boolean,
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
+    callbackfn: (this: This, value: T, index: number, array: this) => void,
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
+    callbackfn: (this: This, value: T, index: number, array: this) => U,
+    thisArg?: This
+  ): {
+    -readonly [K in keyof this]: U;
+  };
   /**
    * Returns the elements of an array that meet the condition specified in a callback function.
    * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
    */
-  filter<S extends T>(
-    predicate: (value: T, index: number, array: readonly T[]) => value is S,
-    thisArg?: any
+  filter<S extends T, This = undefined>(
+    predicate: (this: This, value: T, index: number, array: this) => value is S,
+    thisArg?: This
   ): S[];
   /**
    * Returns the elements of an array that meet the condition specified in a callback function.
    * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
    */
-  filter(
-    predicate: (value: T, index: number, array: readonly T[]) => unknown,
-    thisArg?: any
+  filter<This = undefined>(
+    predicate: (this: This, value: T, index: number, array: this) => boolean,
+    thisArg?: This
   ): T[];
   /**
    * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
-   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
    */
-  reduce(
+  reduce<U = T>(
     callbackfn: (
-      previousValue: T,
+      previousValue: T | U,
       currentValue: T,
       currentIndex: number,
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
+      array: this
+    ) => U
+  ): T | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
    * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
    */
-  reduce<U>(
+  reduce<U = T>(
     callbackfn: (
       previousValue: U,
       currentValue: T,
       currentIndex: number,
-      array: readonly T[]
+      array: this
     ) => U,
     initialValue: U
   ): U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
-   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
    */
-  reduceRight(
+  reduceRight<U = T>(
     callbackfn: (
-      previousValue: T,
+      previousValue: T | U,
       currentValue: T,
       currentIndex: number,
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
+      array: this
+    ) => U
+  ): T | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
    * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
    */
-  reduceRight<U>(
+  reduceRight<U = T>(
     callbackfn: (
       previousValue: U,
       currentValue: T,
       currentIndex: number,
-      array: readonly T[]
+      array: this
     ) => U,
     initialValue: U
   ): U;
 
@@ -1422,9 +1465,8 @@
   readonly [n: number]: T;
   join(separator?: string): string;
   slice(start?: number, end?: number): T[];
 }
-
 interface Array<T> {
   /**
    * Gets or sets the length of the array. This is a number one higher than the highest index in the array.
    */
@@ -1534,23 +1576,25 @@
    * which is coercible to the Boolean value false, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  every<S extends T>(
-    predicate: (value: T, index: number, array: T[]) => value is S,
-    thisArg?: any
-  ): this is S[];
+  every<S extends T, This = undefined>(
+    predicate: (this: This, value: T, index: number, array: this) => value is S,
+    thisArg?: This
+  ): this is {
+    [K in keyof this]: S;
+  };
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
+    predicate: (this: This, value: T, index: number, array: this) => boolean,
+    thisArg?: This
   ): boolean;
   /**
    * Determines whether the specified callback function returns true for any element of an array.
    * @param predicate A function that accepts up to three arguments. The some method calls
@@ -1558,133 +1602,112 @@
    * which is coercible to the Boolean value true, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  some(
-    predicate: (value: T, index: number, array: T[]) => unknown,
-    thisArg?: any
+  some<This = undefined>(
+    predicate: (this: This, value: T, index: number, array: this) => boolean,
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
+    callbackfn: (this: This, value: T, index: number, array: this) => void,
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
+    callbackfn: (this: This, value: T, index: number, array: this) => U,
+    thisArg?: This
+  ): {
+    [K in keyof this]: U;
+  };
   /**
    * Returns the elements of an array that meet the condition specified in a callback function.
    * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
    */
-  filter<S extends T>(
-    predicate: (value: T, index: number, array: T[]) => value is S,
-    thisArg?: any
+  filter<S extends T, This = undefined>(
+    predicate: (this: This, value: T, index: number, array: this) => value is S,
+    thisArg?: This
   ): S[];
   /**
    * Returns the elements of an array that meet the condition specified in a callback function.
    * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
    */
-  filter(
-    predicate: (value: T, index: number, array: T[]) => unknown,
-    thisArg?: any
+  filter<This = undefined>(
+    predicate: (this: This, value: T, index: number, array: this) => boolean,
+    thisArg?: This
   ): T[];
   /**
    * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
-   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
    */
-  reduce(
+  reduce<U = T>(
     callbackfn: (
-      previousValue: T,
+      previousValue: T | U,
       currentValue: T,
       currentIndex: number,
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
+      array: this
+    ) => U
+  ): T | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
    * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
    */
-  reduce<U>(
+  reduce<U = T>(
     callbackfn: (
       previousValue: U,
       currentValue: T,
       currentIndex: number,
-      array: T[]
+      array: this
     ) => U,
     initialValue: U
   ): U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
-   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
    */
-  reduceRight(
+  reduceRight<U = T>(
     callbackfn: (
-      previousValue: T,
+      previousValue: T | U,
       currentValue: T,
       currentIndex: number,
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
+      array: this
+    ) => U
+  ): T | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
    * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
    */
-  reduceRight<U>(
+  reduceRight<U = T>(
     callbackfn: (
       previousValue: U,
       currentValue: T,
       currentIndex: number,
-      array: T[]
+      array: this
     ) => U,
     initialValue: U
   ): U;
 
   [n: number]: T;
 }
-
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
 
 declare var Array: ArrayConstructor;
 
@@ -1716,9 +1739,15 @@
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
 
@@ -2087,13 +2116,8 @@
     byteLength?: number
   ): DataView;
 }
 declare var DataView: DataViewConstructor;
-
-/**
- * A typed array of 8-bit integer values. The contents are initialized to 0. If the requested
- * number of bytes could not be allocated an exception is raised.
- */
 interface Int8Array {
   /**
    * The size in bytes of each element in the array.
    */
@@ -2123,20 +2147,24 @@
    * is treated as length+end.
    * @param end If not specified, length of the this object is used as its default value.
    */
   copyWithin(target: number, start: number, end?: number): this;
-
   /**
    * Determines whether all the members of an array satisfy the specified test.
    * @param predicate A function that accepts up to three arguments. The every method calls
    * the predicate function for each element in the array until the predicate returns a value
    * which is coercible to the Boolean value false, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  every(
-    predicate: (value: number, index: number, array: Int8Array) => unknown,
-    thisArg?: any
+  every<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): boolean;
 
   /**
    * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
@@ -2146,21 +2174,24 @@
    * @param end index to stop filling the array at. If end is negative, it is treated as
    * length+end.
    */
   fill(value: number, start?: number, end?: number): this;
-
   /**
    * Returns the elements of an array that meet the condition specified in a callback function.
    * @param predicate A function that accepts up to three arguments. The filter method calls
    * the predicate function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  filter(
-    predicate: (value: number, index: number, array: Int8Array) => any,
-    thisArg?: any
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): Int8Array;
-
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -2168,13 +2199,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (value: number, index: number, obj: Int8Array) => boolean,
-    thisArg?: any
+  find<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This
   ): number | undefined;
-
   /**
    * Returns the index of the first element in the array where predicate is true, and -1
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -2182,23 +2212,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (value: number, index: number, obj: Int8Array) => boolean,
-    thisArg?: any
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This
   ): number;
-
   /**
    * Performs the specified action for each element in an array.
    * @param callbackfn  A function that accepts up to three arguments. forEach calls the
    * callbackfn function one time for each element in the array.
    * @param thisArg  An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  forEach(
-    callbackfn: (value: number, index: number, array: Int8Array) => void,
-    thisArg?: any
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This
   ): void;
 
   /**
    * Returns the index of the first occurrence of a value in an array.
@@ -2226,50 +2255,40 @@
   /**
    * The length of the array.
    */
   readonly length: number;
-
   /**
    * Calls a defined callback function on each element of an array, and returns an array that
    * contains the results.
    * @param callbackfn A function that accepts up to three arguments. The map method calls the
    * callbackfn function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  map(
-    callbackfn: (value: number, index: number, array: Int8Array) => number,
-    thisArg?: any
+  map<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => number,
+    thisArg?: This
   ): Int8Array;
-
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
    * callbackfn function one time for each element in the array.
-   * @param initialValue If initialValue is specified, it is used as the initial value to start
-   * the accumulation. The first call to the callbackfn function provides this value as an argument
-   * instead of an array value.
    */
-  reduce(
+  reduce<U = number>(
     callbackfn: (
-      previousValue: number,
+      previousValue: number | U,
       currentValue: number,
       currentIndex: number,
-      array: Int8Array
-    ) => number
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Int8Array
-    ) => number,
-    initialValue: number
-  ): number;
-
+      array: this
+    ) => U
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -2278,46 +2297,32 @@
    * @param initialValue If initialValue is specified, it is used as the initial value to start
    * the accumulation. The first call to the callbackfn function provides this value as an argument
    * instead of an array value.
    */
-  reduce<U>(
+  reduce<U = number>(
     callbackfn: (
       previousValue: U,
       currentValue: number,
       currentIndex: number,
-      array: Int8Array
+      array: this
     ) => U,
     initialValue: U
   ): U;
-
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
    * the callbackfn function one time for each element in the array.
-   * @param initialValue If initialValue is specified, it is used as the initial value to start
-   * the accumulation. The first call to the callbackfn function provides this value as an
-   * argument instead of an array value.
    */
-  reduceRight(
+  reduceRight<U = number>(
     callbackfn: (
-      previousValue: number,
+      previousValue: number | U,
       currentValue: number,
       currentIndex: number,
-      array: Int8Array
-    ) => number
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Int8Array
-    ) => number,
-    initialValue: number
-  ): number;
-
+      array: this
+    ) => U
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -2326,14 +2331,14 @@
    * @param initialValue If initialValue is specified, it is used as the initial value to start
    * the accumulation. The first call to the callbackfn function provides this value as an argument
    * instead of an array value.
    */
-  reduceRight<U>(
+  reduceRight<U = number>(
     callbackfn: (
       previousValue: U,
       currentValue: number,
       currentIndex: number,
-      array: Int8Array
+      array: this
     ) => U,
     initialValue: U
   ): U;
 
@@ -2354,20 +2359,24 @@
    * @param start The beginning of the specified portion of the array.
    * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
    */
   slice(start?: number, end?: number): Int8Array;
-
   /**
    * Determines whether the specified callback function returns true for any element of an array.
    * @param predicate A function that accepts up to three arguments. The some method calls
    * the predicate function for each element in the array until the predicate returns a value
    * which is coercible to the Boolean value true, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  some(
-    predicate: (value: number, index: number, array: Int8Array) => unknown,
-    thisArg?: any
+  some<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): boolean;
 
   /**
    * Sorts an array.
@@ -2422,33 +2431,26 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Int8Array;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like or iterable object to convert to an array.
+   * @param source An array-like or iterable object to convert to an array.
    */
-  from(arrayLike: ArrayLike<number>): Int8Array;
-
+  from(source: ArrayLike<number>): Int8Array;
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like or iterable object to convert to an array.
+   * @param source An array-like or iterable object to convert to an array.
    * @param mapfn A mapping function to call on every element of the array.
    * @param thisArg Value of 'this' used to invoke the mapfn.
    */
-  from<T>(
-    arrayLike: ArrayLike<T>,
-    mapfn: (v: T, k: number) => number,
-    thisArg?: any
+  from<T, This = undefined>(
+    source: ArrayLike<T>,
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This
   ): Int8Array;
 }
 declare var Int8Array: Int8ArrayConstructor;
-
-/**
- * A typed array of 8-bit unsigned integer values. The contents are initialized to 0. If the
- * requested number of bytes could not be allocated an exception is raised.
- */
 interface Uint8Array {
   /**
    * The size in bytes of each element in the array.
    */
@@ -2478,20 +2480,24 @@
    * is treated as length+end.
    * @param end If not specified, length of the this object is used as its default value.
    */
   copyWithin(target: number, start: number, end?: number): this;
-
   /**
    * Determines whether all the members of an array satisfy the specified test.
    * @param predicate A function that accepts up to three arguments. The every method calls
    * the predicate function for each element in the array until the predicate returns a value
    * which is coercible to the Boolean value false, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  every(
-    predicate: (value: number, index: number, array: Uint8Array) => unknown,
-    thisArg?: any
+  every<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): boolean;
 
   /**
    * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
@@ -2501,21 +2507,24 @@
    * @param end index to stop filling the array at. If end is negative, it is treated as
    * length+end.
    */
   fill(value: number, start?: number, end?: number): this;
-
   /**
    * Returns the elements of an array that meet the condition specified in a callback function.
    * @param predicate A function that accepts up to three arguments. The filter method calls
    * the predicate function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  filter(
-    predicate: (value: number, index: number, array: Uint8Array) => any,
-    thisArg?: any
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): Uint8Array;
-
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -2523,13 +2532,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (value: number, index: number, obj: Uint8Array) => boolean,
-    thisArg?: any
+  find<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This
   ): number | undefined;
-
   /**
    * Returns the index of the first element in the array where predicate is true, and -1
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -2537,23 +2545,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (value: number, index: number, obj: Uint8Array) => boolean,
-    thisArg?: any
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This
   ): number;
-
   /**
    * Performs the specified action for each element in an array.
    * @param callbackfn  A function that accepts up to three arguments. forEach calls the
    * callbackfn function one time for each element in the array.
    * @param thisArg  An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  forEach(
-    callbackfn: (value: number, index: number, array: Uint8Array) => void,
-    thisArg?: any
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This
   ): void;
 
   /**
    * Returns the index of the first occurrence of a value in an array.
@@ -2581,50 +2588,40 @@
   /**
    * The length of the array.
    */
   readonly length: number;
-
   /**
    * Calls a defined callback function on each element of an array, and returns an array that
    * contains the results.
    * @param callbackfn A function that accepts up to three arguments. The map method calls the
    * callbackfn function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  map(
-    callbackfn: (value: number, index: number, array: Uint8Array) => number,
-    thisArg?: any
+  map<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => number,
+    thisArg?: This
   ): Uint8Array;
-
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
    * callbackfn function one time for each element in the array.
-   * @param initialValue If initialValue is specified, it is used as the initial value to start
-   * the accumulation. The first call to the callbackfn function provides this value as an argument
-   * instead of an array value.
    */
-  reduce(
+  reduce<U = number>(
     callbackfn: (
-      previousValue: number,
+      previousValue: number | U,
       currentValue: number,
       currentIndex: number,
-      array: Uint8Array
-    ) => number
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Uint8Array
-    ) => number,
-    initialValue: number
-  ): number;
-
+      array: this
+    ) => U
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -2633,46 +2630,32 @@
    * @param initialValue If initialValue is specified, it is used as the initial value to start
    * the accumulation. The first call to the callbackfn function provides this value as an argument
    * instead of an array value.
    */
-  reduce<U>(
+  reduce<U = number>(
     callbackfn: (
       previousValue: U,
       currentValue: number,
       currentIndex: number,
-      array: Uint8Array
+      array: this
     ) => U,
     initialValue: U
   ): U;
-
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
    * the callbackfn function one time for each element in the array.
-   * @param initialValue If initialValue is specified, it is used as the initial value to start
-   * the accumulation. The first call to the callbackfn function provides this value as an
-   * argument instead of an array value.
    */
-  reduceRight(
+  reduceRight<U = number>(
     callbackfn: (
-      previousValue: number,
+      previousValue: number | U,
       currentValue: number,
       currentIndex: number,
-      array: Uint8Array
-    ) => number
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Uint8Array
-    ) => number,
-    initialValue: number
-  ): number;
-
+      array: this
+    ) => U
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -2681,14 +2664,14 @@
    * @param initialValue If initialValue is specified, it is used as the initial value to start
    * the accumulation. The first call to the callbackfn function provides this value as an argument
    * instead of an array value.
    */
-  reduceRight<U>(
+  reduceRight<U = number>(
     callbackfn: (
       previousValue: U,
       currentValue: number,
       currentIndex: number,
-      array: Uint8Array
+      array: this
     ) => U,
     initialValue: U
   ): U;
 
@@ -2709,20 +2692,24 @@
    * @param start The beginning of the specified portion of the array.
    * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
    */
   slice(start?: number, end?: number): Uint8Array;
-
   /**
    * Determines whether the specified callback function returns true for any element of an array.
    * @param predicate A function that accepts up to three arguments. The some method calls
    * the predicate function for each element in the array until the predicate returns a value
    * which is coercible to the Boolean value true, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  some(
-    predicate: (value: number, index: number, array: Uint8Array) => unknown,
-    thisArg?: any
+  some<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): boolean;
 
   /**
    * Sorts an array.
@@ -2757,9 +2744,8 @@
   valueOf(): Uint8Array;
 
   [index: number]: number;
 }
-
 interface Uint8ArrayConstructor {
   readonly prototype: Uint8Array;
   new (length: number): Uint8Array;
   new (array: ArrayLike<number> | ArrayBufferLike): Uint8Array;
@@ -2778,33 +2764,26 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Uint8Array;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like or iterable object to convert to an array.
+   * @param source An array-like or iterable object to convert to an array.
    */
-  from(arrayLike: ArrayLike<number>): Uint8Array;
-
+  from(source: ArrayLike<number>): Uint8Array;
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like or iterable object to convert to an array.
+   * @param source An array-like or iterable object to convert to an array.
    * @param mapfn A mapping function to call on every element of the array.
    * @param thisArg Value of 'this' used to invoke the mapfn.
    */
-  from<T>(
-    arrayLike: ArrayLike<T>,
-    mapfn: (v: T, k: number) => number,
-    thisArg?: any
+  from<T, This = undefined>(
+    source: ArrayLike<T>,
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This
   ): Uint8Array;
 }
 declare var Uint8Array: Uint8ArrayConstructor;
-
-/**
- * A typed array of 8-bit unsigned integer (clamped) values. The contents are initialized to 0.
- * If the requested number of bytes could not be allocated an exception is raised.
- */
 interface Uint8ClampedArray {
   /**
    * The size in bytes of each element in the array.
    */
@@ -2834,24 +2813,24 @@
    * is treated as length+end.
    * @param end If not specified, length of the this object is used as its default value.
    */
   copyWithin(target: number, start: number, end?: number): this;
-
   /**
    * Determines whether all the members of an array satisfy the specified test.
    * @param predicate A function that accepts up to three arguments. The every method calls
    * the predicate function for each element in the array until the predicate returns a value
    * which is coercible to the Boolean value false, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  every(
+  every<This = undefined>(
     predicate: (
+      this: This,
       value: number,
       index: number,
-      array: Uint8ClampedArray
-    ) => unknown,
-    thisArg?: any
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): boolean;
 
   /**
    * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
@@ -2861,21 +2840,24 @@
    * @param end index to stop filling the array at. If end is negative, it is treated as
    * length+end.
    */
   fill(value: number, start?: number, end?: number): this;
-
   /**
    * Returns the elements of an array that meet the condition specified in a callback function.
    * @param predicate A function that accepts up to three arguments. The filter method calls
    * the predicate function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  filter(
-    predicate: (value: number, index: number, array: Uint8ClampedArray) => any,
-    thisArg?: any
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): Uint8ClampedArray;
-
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -2883,17 +2865,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (
-      value: number,
-      index: number,
-      obj: Uint8ClampedArray
-    ) => boolean,
-    thisArg?: any
+  find<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This
   ): number | undefined;
-
   /**
    * Returns the index of the first element in the array where predicate is true, and -1
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -2901,31 +2878,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (
-      value: number,
-      index: number,
-      obj: Uint8ClampedArray
-    ) => boolean,
-    thisArg?: any
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This
   ): number;
-
   /**
    * Performs the specified action for each element in an array.
    * @param callbackfn  A function that accepts up to three arguments. forEach calls the
    * callbackfn function one time for each element in the array.
    * @param thisArg  An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  forEach(
-    callbackfn: (
-      value: number,
-      index: number,
-      array: Uint8ClampedArray
-    ) => void,
-    thisArg?: any
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This
   ): void;
 
   /**
    * Returns the index of the first occurrence of a value in an array.
@@ -2953,54 +2921,40 @@
   /**
    * The length of the array.
    */
   readonly length: number;
-
   /**
    * Calls a defined callback function on each element of an array, and returns an array that
    * contains the results.
    * @param callbackfn A function that accepts up to three arguments. The map method calls the
    * callbackfn function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  map(
+  map<This = undefined>(
     callbackfn: (
+      this: This,
       value: number,
       index: number,
-      array: Uint8ClampedArray
+      array: this
     ) => number,
-    thisArg?: any
+    thisArg?: This
   ): Uint8ClampedArray;
-
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
    * callbackfn function one time for each element in the array.
-   * @param initialValue If initialValue is specified, it is used as the initial value to start
-   * the accumulation. The first call to the callbackfn function provides this value as an argument
-   * instead of an array value.
    */
-  reduce(
+  reduce<U = number>(
     callbackfn: (
-      previousValue: number,
+      previousValue: number | U,
       currentValue: number,
       currentIndex: number,
-      array: Uint8ClampedArray
-    ) => number
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Uint8ClampedArray
-    ) => number,
-    initialValue: number
-  ): number;
-
+      array: this
+    ) => U
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -3009,46 +2963,32 @@
    * @param initialValue If initialValue is specified, it is used as the initial value to start
    * the accumulation. The first call to the callbackfn function provides this value as an argument
    * instead of an array value.
    */
-  reduce<U>(
+  reduce<U = number>(
     callbackfn: (
       previousValue: U,
       currentValue: number,
       currentIndex: number,
-      array: Uint8ClampedArray
+      array: this
     ) => U,
     initialValue: U
   ): U;
-
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
    * the callbackfn function one time for each element in the array.
-   * @param initialValue If initialValue is specified, it is used as the initial value to start
-   * the accumulation. The first call to the callbackfn function provides this value as an
-   * argument instead of an array value.
    */
-  reduceRight(
+  reduceRight<U = number>(
     callbackfn: (
-      previousValue: number,
+      previousValue: number | U,
       currentValue: number,
       currentIndex: number,
-      array: Uint8ClampedArray
-    ) => number
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Uint8ClampedArray
-    ) => number,
-    initialValue: number
-  ): number;
-
+      array: this
+    ) => U
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -3057,14 +2997,14 @@
    * @param initialValue If initialValue is specified, it is used as the initial value to start
    * the accumulation. The first call to the callbackfn function provides this value as an argument
    * instead of an array value.
    */
-  reduceRight<U>(
+  reduceRight<U = number>(
     callbackfn: (
       previousValue: U,
       currentValue: number,
       currentIndex: number,
-      array: Uint8ClampedArray
+      array: this
     ) => U,
     initialValue: U
   ): U;
 
@@ -3085,24 +3025,24 @@
    * @param start The beginning of the specified portion of the array.
    * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
    */
   slice(start?: number, end?: number): Uint8ClampedArray;
-
   /**
    * Determines whether the specified callback function returns true for any element of an array.
    * @param predicate A function that accepts up to three arguments. The some method calls
    * the predicate function for each element in the array until the predicate returns a value
    * which is coercible to the Boolean value true, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  some(
+  some<This = undefined>(
     predicate: (
+      this: This,
       value: number,
       index: number,
-      array: Uint8ClampedArray
-    ) => unknown,
-    thisArg?: any
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): boolean;
 
   /**
    * Sorts an array.
@@ -3137,9 +3077,8 @@
   valueOf(): Uint8ClampedArray;
 
   [index: number]: number;
 }
-
 interface Uint8ClampedArrayConstructor {
   readonly prototype: Uint8ClampedArray;
   new (length: number): Uint8ClampedArray;
   new (array: ArrayLike<number> | ArrayBufferLike): Uint8ClampedArray;
@@ -3158,33 +3097,26 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Uint8ClampedArray;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like or iterable object to convert to an array.
+   * @param source An array-like or iterable object to convert to an array.
    */
-  from(arrayLike: ArrayLike<number>): Uint8ClampedArray;
-
+  from(source: ArrayLike<number>): Uint8ClampedArray;
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like or iterable object to convert to an array.
+   * @param source An array-like or iterable object to convert to an array.
    * @param mapfn A mapping function to call on every element of the array.
    * @param thisArg Value of 'this' used to invoke the mapfn.
    */
-  from<T>(
-    arrayLike: ArrayLike<T>,
-    mapfn: (v: T, k: number) => number,
-    thisArg?: any
+  from<T, This = undefined>(
+    source: ArrayLike<T>,
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This
   ): Uint8ClampedArray;
 }
 declare var Uint8ClampedArray: Uint8ClampedArrayConstructor;
-
-/**
- * A typed array of 16-bit signed integer values. The contents are initialized to 0. If the
- * requested number of bytes could not be allocated an exception is raised.
- */
 interface Int16Array {
   /**
    * The size in bytes of each element in the array.
    */
@@ -3214,20 +3146,24 @@
    * is treated as length+end.
    * @param end If not specified, length of the this object is used as its default value.
    */
   copyWithin(target: number, start: number, end?: number): this;
-
   /**
    * Determines whether all the members of an array satisfy the specified test.
    * @param predicate A function that accepts up to three arguments. The every method calls
    * the predicate function for each element in the array until the predicate returns a value
    * which is coercible to the Boolean value false, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  every(
-    predicate: (value: number, index: number, array: Int16Array) => unknown,
-    thisArg?: any
+  every<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): boolean;
 
   /**
    * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
@@ -3237,21 +3173,24 @@
    * @param end index to stop filling the array at. If end is negative, it is treated as
    * length+end.
    */
   fill(value: number, start?: number, end?: number): this;
-
   /**
    * Returns the elements of an array that meet the condition specified in a callback function.
    * @param predicate A function that accepts up to three arguments. The filter method calls
    * the predicate function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  filter(
-    predicate: (value: number, index: number, array: Int16Array) => any,
-    thisArg?: any
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): Int16Array;
-
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -3259,13 +3198,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (value: number, index: number, obj: Int16Array) => boolean,
-    thisArg?: any
+  find<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This
   ): number | undefined;
-
   /**
    * Returns the index of the first element in the array where predicate is true, and -1
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -3273,23 +3211,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (value: number, index: number, obj: Int16Array) => boolean,
-    thisArg?: any
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This
   ): number;
-
   /**
    * Performs the specified action for each element in an array.
    * @param callbackfn  A function that accepts up to three arguments. forEach calls the
    * callbackfn function one time for each element in the array.
    * @param thisArg  An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  forEach(
-    callbackfn: (value: number, index: number, array: Int16Array) => void,
-    thisArg?: any
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This
   ): void;
   /**
    * Returns the index of the first occurrence of a value in an array.
    * @param searchElement The value to locate in the array.
@@ -3316,50 +3253,40 @@
   /**
    * The length of the array.
    */
   readonly length: number;
-
   /**
    * Calls a defined callback function on each element of an array, and returns an array that
    * contains the results.
    * @param callbackfn A function that accepts up to three arguments. The map method calls the
    * callbackfn function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  map(
-    callbackfn: (value: number, index: number, array: Int16Array) => number,
-    thisArg?: any
+  map<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => number,
+    thisArg?: This
   ): Int16Array;
-
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
    * callbackfn function one time for each element in the array.
-   * @param initialValue If initialValue is specified, it is used as the initial value to start
-   * the accumulation. The first call to the callbackfn function provides this value as an argument
-   * instead of an array value.
    */
-  reduce(
+  reduce<U = number>(
     callbackfn: (
-      previousValue: number,
+      previousValue: number | U,
       currentValue: number,
       currentIndex: number,
-      array: Int16Array
-    ) => number
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Int16Array
-    ) => number,
-    initialValue: number
-  ): number;
-
+      array: this
+    ) => U
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -3368,46 +3295,32 @@
    * @param initialValue If initialValue is specified, it is used as the initial value to start
    * the accumulation. The first call to the callbackfn function provides this value as an argument
    * instead of an array value.
    */
-  reduce<U>(
+  reduce<U = number>(
     callbackfn: (
       previousValue: U,
       currentValue: number,
       currentIndex: number,
-      array: Int16Array
+      array: this
     ) => U,
     initialValue: U
   ): U;
-
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
    * the callbackfn function one time for each element in the array.
-   * @param initialValue If initialValue is specified, it is used as the initial value to start
-   * the accumulation. The first call to the callbackfn function provides this value as an
-   * argument instead of an array value.
    */
-  reduceRight(
+  reduceRight<U = number>(
     callbackfn: (
-      previousValue: number,
+      previousValue: number | U,
       currentValue: number,
       currentIndex: number,
-      array: Int16Array
-    ) => number
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Int16Array
-    ) => number,
-    initialValue: number
-  ): number;
-
+      array: this
+    ) => U
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -3416,14 +3329,14 @@
    * @param initialValue If initialValue is specified, it is used as the initial value to start
    * the accumulation. The first call to the callbackfn function provides this value as an argument
    * instead of an array value.
    */
-  reduceRight<U>(
+  reduceRight<U = number>(
     callbackfn: (
       previousValue: U,
       currentValue: number,
       currentIndex: number,
-      array: Int16Array
+      array: this
     ) => U,
     initialValue: U
   ): U;
 
@@ -3444,20 +3357,24 @@
    * @param start The beginning of the specified portion of the array.
    * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
    */
   slice(start?: number, end?: number): Int16Array;
-
   /**
    * Determines whether the specified callback function returns true for any element of an array.
    * @param predicate A function that accepts up to three arguments. The some method calls
    * the predicate function for each element in the array until the predicate returns a value
    * which is coercible to the Boolean value true, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  some(
-    predicate: (value: number, index: number, array: Int16Array) => unknown,
-    thisArg?: any
+  some<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): boolean;
 
   /**
    * Sorts an array.
@@ -3492,9 +3409,8 @@
   valueOf(): Int16Array;
 
   [index: number]: number;
 }
-
 interface Int16ArrayConstructor {
   readonly prototype: Int16Array;
   new (length: number): Int16Array;
   new (array: ArrayLike<number> | ArrayBufferLike): Int16Array;
@@ -3513,33 +3429,26 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Int16Array;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like or iterable object to convert to an array.
+   * @param source An array-like or iterable object to convert to an array.
    */
-  from(arrayLike: ArrayLike<number>): Int16Array;
-
+  from(source: ArrayLike<number>): Int16Array;
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like or iterable object to convert to an array.
+   * @param source An array-like or iterable object to convert to an array.
    * @param mapfn A mapping function to call on every element of the array.
    * @param thisArg Value of 'this' used to invoke the mapfn.
    */
-  from<T>(
-    arrayLike: ArrayLike<T>,
-    mapfn: (v: T, k: number) => number,
-    thisArg?: any
+  from<T, This = undefined>(
+    source: ArrayLike<T>,
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This
   ): Int16Array;
 }
 declare var Int16Array: Int16ArrayConstructor;
-
-/**
- * A typed array of 16-bit unsigned integer values. The contents are initialized to 0. If the
- * requested number of bytes could not be allocated an exception is raised.
- */
 interface Uint16Array {
   /**
    * The size in bytes of each element in the array.
    */
@@ -3569,20 +3478,24 @@
    * is treated as length+end.
    * @param end If not specified, length of the this object is used as its default value.
    */
   copyWithin(target: number, start: number, end?: number): this;
-
   /**
    * Determines whether all the members of an array satisfy the specified test.
    * @param predicate A function that accepts up to three arguments. The every method calls
    * the predicate function for each element in the array until the predicate returns a value
    * which is coercible to the Boolean value false, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  every(
-    predicate: (value: number, index: number, array: Uint16Array) => unknown,
-    thisArg?: any
+  every<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): boolean;
 
   /**
    * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
@@ -3592,21 +3505,24 @@
    * @param end index to stop filling the array at. If end is negative, it is treated as
    * length+end.
    */
   fill(value: number, start?: number, end?: number): this;
-
   /**
    * Returns the elements of an array that meet the condition specified in a callback function.
    * @param predicate A function that accepts up to three arguments. The filter method calls
    * the predicate function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  filter(
-    predicate: (value: number, index: number, array: Uint16Array) => any,
-    thisArg?: any
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): Uint16Array;
-
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -3614,13 +3530,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (value: number, index: number, obj: Uint16Array) => boolean,
-    thisArg?: any
+  find<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This
   ): number | undefined;
-
   /**
    * Returns the index of the first element in the array where predicate is true, and -1
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -3628,23 +3543,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (value: number, index: number, obj: Uint16Array) => boolean,
-    thisArg?: any
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This
   ): number;
-
   /**
    * Performs the specified action for each element in an array.
    * @param callbackfn  A function that accepts up to three arguments. forEach calls the
    * callbackfn function one time for each element in the array.
    * @param thisArg  An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  forEach(
-    callbackfn: (value: number, index: number, array: Uint16Array) => void,
-    thisArg?: any
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This
   ): void;
 
   /**
    * Returns the index of the first occurrence of a value in an array.
@@ -3672,50 +3586,40 @@
   /**
    * The length of the array.
    */
   readonly length: number;
-
   /**
    * Calls a defined callback function on each element of an array, and returns an array that
    * contains the results.
    * @param callbackfn A function that accepts up to three arguments. The map method calls the
    * callbackfn function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  map(
-    callbackfn: (value: number, index: number, array: Uint16Array) => number,
-    thisArg?: any
+  map<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => number,
+    thisArg?: This
   ): Uint16Array;
-
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
    * callbackfn function one time for each element in the array.
-   * @param initialValue If initialValue is specified, it is used as the initial value to start
-   * the accumulation. The first call to the callbackfn function provides this value as an argument
-   * instead of an array value.
    */
-  reduce(
+  reduce<U = number>(
     callbackfn: (
-      previousValue: number,
+      previousValue: number | U,
       currentValue: number,
       currentIndex: number,
-      array: Uint16Array
-    ) => number
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Uint16Array
-    ) => number,
-    initialValue: number
-  ): number;
-
+      array: this
+    ) => U
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -3724,46 +3628,32 @@
    * @param initialValue If initialValue is specified, it is used as the initial value to start
    * the accumulation. The first call to the callbackfn function provides this value as an argument
    * instead of an array value.
    */
-  reduce<U>(
+  reduce<U = number>(
     callbackfn: (
       previousValue: U,
       currentValue: number,
       currentIndex: number,
-      array: Uint16Array
+      array: this
     ) => U,
     initialValue: U
   ): U;
-
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
    * the callbackfn function one time for each element in the array.
-   * @param initialValue If initialValue is specified, it is used as the initial value to start
-   * the accumulation. The first call to the callbackfn function provides this value as an
-   * argument instead of an array value.
    */
-  reduceRight(
+  reduceRight<U = number>(
     callbackfn: (
-      previousValue: number,
+      previousValue: number | U,
       currentValue: number,
       currentIndex: number,
-      array: Uint16Array
-    ) => number
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Uint16Array
-    ) => number,
-    initialValue: number
-  ): number;
-
+      array: this
+    ) => U
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -3772,14 +3662,14 @@
    * @param initialValue If initialValue is specified, it is used as the initial value to start
    * the accumulation. The first call to the callbackfn function provides this value as an argument
    * instead of an array value.
    */
-  reduceRight<U>(
+  reduceRight<U = number>(
     callbackfn: (
       previousValue: U,
       currentValue: number,
       currentIndex: number,
-      array: Uint16Array
+      array: this
     ) => U,
     initialValue: U
   ): U;
 
@@ -3800,20 +3690,24 @@
    * @param start The beginning of the specified portion of the array.
    * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
    */
   slice(start?: number, end?: number): Uint16Array;
-
   /**
    * Determines whether the specified callback function returns true for any element of an array.
    * @param predicate A function that accepts up to three arguments. The some method calls
    * the predicate function for each element in the array until the predicate returns a value
    * which is coercible to the Boolean value true, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  some(
-    predicate: (value: number, index: number, array: Uint16Array) => unknown,
-    thisArg?: any
+  some<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): boolean;
 
   /**
    * Sorts an array.
@@ -3848,9 +3742,8 @@
   valueOf(): Uint16Array;
 
   [index: number]: number;
 }
-
 interface Uint16ArrayConstructor {
   readonly prototype: Uint16Array;
   new (length: number): Uint16Array;
   new (array: ArrayLike<number> | ArrayBufferLike): Uint16Array;
@@ -3869,32 +3762,26 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Uint16Array;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like or iterable object to convert to an array.
+   * @param source An array-like or iterable object to convert to an array.
    */
-  from(arrayLike: ArrayLike<number>): Uint16Array;
-
+  from(source: ArrayLike<number>): Uint16Array;
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like or iterable object to convert to an array.
+   * @param source An array-like or iterable object to convert to an array.
    * @param mapfn A mapping function to call on every element of the array.
    * @param thisArg Value of 'this' used to invoke the mapfn.
    */
-  from<T>(
-    arrayLike: ArrayLike<T>,
-    mapfn: (v: T, k: number) => number,
-    thisArg?: any
+  from<T, This = undefined>(
+    source: ArrayLike<T>,
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This
   ): Uint16Array;
 }
 declare var Uint16Array: Uint16ArrayConstructor;
-/**
- * A typed array of 32-bit signed integer values. The contents are initialized to 0. If the
- * requested number of bytes could not be allocated an exception is raised.
- */
 interface Int32Array {
   /**
    * The size in bytes of each element in the array.
    */
@@ -3924,20 +3811,24 @@
    * is treated as length+end.
    * @param end If not specified, length of the this object is used as its default value.
    */
   copyWithin(target: number, start: number, end?: number): this;
-
   /**
    * Determines whether all the members of an array satisfy the specified test.
    * @param predicate A function that accepts up to three arguments. The every method calls
    * the predicate function for each element in the array until the predicate returns a value
    * which is coercible to the Boolean value false, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  every(
-    predicate: (value: number, index: number, array: Int32Array) => unknown,
-    thisArg?: any
+  every<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): boolean;
 
   /**
    * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
@@ -3947,21 +3838,24 @@
    * @param end index to stop filling the array at. If end is negative, it is treated as
    * length+end.
    */
   fill(value: number, start?: number, end?: number): this;
-
   /**
    * Returns the elements of an array that meet the condition specified in a callback function.
    * @param predicate A function that accepts up to three arguments. The filter method calls
    * the predicate function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  filter(
-    predicate: (value: number, index: number, array: Int32Array) => any,
-    thisArg?: any
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): Int32Array;
-
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -3969,13 +3863,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (value: number, index: number, obj: Int32Array) => boolean,
-    thisArg?: any
+  find<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This
   ): number | undefined;
-
   /**
    * Returns the index of the first element in the array where predicate is true, and -1
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -3983,23 +3876,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (value: number, index: number, obj: Int32Array) => boolean,
-    thisArg?: any
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This
   ): number;
-
   /**
    * Performs the specified action for each element in an array.
    * @param callbackfn  A function that accepts up to three arguments. forEach calls the
    * callbackfn function one time for each element in the array.
    * @param thisArg  An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  forEach(
-    callbackfn: (value: number, index: number, array: Int32Array) => void,
-    thisArg?: any
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This
   ): void;
 
   /**
    * Returns the index of the first occurrence of a value in an array.
@@ -4027,50 +3919,40 @@
   /**
    * The length of the array.
    */
   readonly length: number;
-
   /**
    * Calls a defined callback function on each element of an array, and returns an array that
    * contains the results.
    * @param callbackfn A function that accepts up to three arguments. The map method calls the
    * callbackfn function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  map(
-    callbackfn: (value: number, index: number, array: Int32Array) => number,
-    thisArg?: any
+  map<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => number,
+    thisArg?: This
   ): Int32Array;
-
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
    * callbackfn function one time for each element in the array.
-   * @param initialValue If initialValue is specified, it is used as the initial value to start
-   * the accumulation. The first call to the callbackfn function provides this value as an argument
-   * instead of an array value.
    */
-  reduce(
+  reduce<U = number>(
     callbackfn: (
-      previousValue: number,
+      previousValue: number | U,
       currentValue: number,
       currentIndex: number,
-      array: Int32Array
-    ) => number
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Int32Array
-    ) => number,
-    initialValue: number
-  ): number;
-
+      array: this
+    ) => U
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -4079,46 +3961,32 @@
    * @param initialValue If initialValue is specified, it is used as the initial value to start
    * the accumulation. The first call to the callbackfn function provides this value as an argument
    * instead of an array value.
    */
-  reduce<U>(
+  reduce<U = number>(
     callbackfn: (
       previousValue: U,
       currentValue: number,
       currentIndex: number,
-      array: Int32Array
+      array: this
     ) => U,
     initialValue: U
   ): U;
-
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
    * the callbackfn function one time for each element in the array.
-   * @param initialValue If initialValue is specified, it is used as the initial value to start
-   * the accumulation. The first call to the callbackfn function provides this value as an
-   * argument instead of an array value.
    */
-  reduceRight(
+  reduceRight<U = number>(
     callbackfn: (
-      previousValue: number,
+      previousValue: number | U,
       currentValue: number,
       currentIndex: number,
-      array: Int32Array
-    ) => number
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Int32Array
-    ) => number,
-    initialValue: number
-  ): number;
-
+      array: this
+    ) => U
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -4127,14 +3995,14 @@
    * @param initialValue If initialValue is specified, it is used as the initial value to start
    * the accumulation. The first call to the callbackfn function provides this value as an argument
    * instead of an array value.
    */
-  reduceRight<U>(
+  reduceRight<U = number>(
     callbackfn: (
       previousValue: U,
       currentValue: number,
       currentIndex: number,
-      array: Int32Array
+      array: this
     ) => U,
     initialValue: U
   ): U;
 
@@ -4155,20 +4023,24 @@
    * @param start The beginning of the specified portion of the array.
    * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
    */
   slice(start?: number, end?: number): Int32Array;
-
   /**
    * Determines whether the specified callback function returns true for any element of an array.
    * @param predicate A function that accepts up to three arguments. The some method calls
    * the predicate function for each element in the array until the predicate returns a value
    * which is coercible to the Boolean value true, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  some(
-    predicate: (value: number, index: number, array: Int32Array) => unknown,
-    thisArg?: any
+  some<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): boolean;
 
   /**
    * Sorts an array.
@@ -4203,9 +4075,8 @@
   valueOf(): Int32Array;
 
   [index: number]: number;
 }
-
 interface Int32ArrayConstructor {
   readonly prototype: Int32Array;
   new (length: number): Int32Array;
   new (array: ArrayLike<number> | ArrayBufferLike): Int32Array;
@@ -4224,33 +4095,26 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Int32Array;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like or iterable object to convert to an array.
+   * @param source An array-like or iterable object to convert to an array.
    */
-  from(arrayLike: ArrayLike<number>): Int32Array;
-
+  from(source: ArrayLike<number>): Int32Array;
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like or iterable object to convert to an array.
+   * @param source An array-like or iterable object to convert to an array.
    * @param mapfn A mapping function to call on every element of the array.
    * @param thisArg Value of 'this' used to invoke the mapfn.
    */
-  from<T>(
-    arrayLike: ArrayLike<T>,
-    mapfn: (v: T, k: number) => number,
-    thisArg?: any
+  from<T, This = undefined>(
+    source: ArrayLike<T>,
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This
   ): Int32Array;
 }
 declare var Int32Array: Int32ArrayConstructor;
-
-/**
- * A typed array of 32-bit unsigned integer values. The contents are initialized to 0. If the
- * requested number of bytes could not be allocated an exception is raised.
- */
 interface Uint32Array {
   /**
    * The size in bytes of each element in the array.
    */
@@ -4280,20 +4144,24 @@
    * is treated as length+end.
    * @param end If not specified, length of the this object is used as its default value.
    */
   copyWithin(target: number, start: number, end?: number): this;
-
   /**
    * Determines whether all the members of an array satisfy the specified test.
    * @param predicate A function that accepts up to three arguments. The every method calls
    * the predicate function for each element in the array until the predicate returns a value
    * which is coercible to the Boolean value false, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  every(
-    predicate: (value: number, index: number, array: Uint32Array) => unknown,
-    thisArg?: any
+  every<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): boolean;
 
   /**
    * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
@@ -4303,21 +4171,24 @@
    * @param end index to stop filling the array at. If end is negative, it is treated as
    * length+end.
    */
   fill(value: number, start?: number, end?: number): this;
-
   /**
    * Returns the elements of an array that meet the condition specified in a callback function.
    * @param predicate A function that accepts up to three arguments. The filter method calls
    * the predicate function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  filter(
-    predicate: (value: number, index: number, array: Uint32Array) => any,
-    thisArg?: any
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): Uint32Array;
-
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -4325,13 +4196,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (value: number, index: number, obj: Uint32Array) => boolean,
-    thisArg?: any
+  find<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This
   ): number | undefined;
-
   /**
    * Returns the index of the first element in the array where predicate is true, and -1
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -4339,23 +4209,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (value: number, index: number, obj: Uint32Array) => boolean,
-    thisArg?: any
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This
   ): number;
-
   /**
    * Performs the specified action for each element in an array.
    * @param callbackfn  A function that accepts up to three arguments. forEach calls the
    * callbackfn function one time for each element in the array.
    * @param thisArg  An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  forEach(
-    callbackfn: (value: number, index: number, array: Uint32Array) => void,
-    thisArg?: any
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This
   ): void;
   /**
    * Returns the index of the first occurrence of a value in an array.
    * @param searchElement The value to locate in the array.
@@ -4382,50 +4251,40 @@
   /**
    * The length of the array.
    */
   readonly length: number;
-
   /**
    * Calls a defined callback function on each element of an array, and returns an array that
    * contains the results.
    * @param callbackfn A function that accepts up to three arguments. The map method calls the
    * callbackfn function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  map(
-    callbackfn: (value: number, index: number, array: Uint32Array) => number,
-    thisArg?: any
+  map<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => number,
+    thisArg?: This
   ): Uint32Array;
-
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
    * callbackfn function one time for each element in the array.
-   * @param initialValue If initialValue is specified, it is used as the initial value to start
-   * the accumulation. The first call to the callbackfn function provides this value as an argument
-   * instead of an array value.
    */
-  reduce(
+  reduce<U = number>(
     callbackfn: (
-      previousValue: number,
+      previousValue: number | U,
       currentValue: number,
       currentIndex: number,
-      array: Uint32Array
-    ) => number
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Uint32Array
-    ) => number,
-    initialValue: number
-  ): number;
-
+      array: this
+    ) => U
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -4434,46 +4293,32 @@
    * @param initialValue If initialValue is specified, it is used as the initial value to start
    * the accumulation. The first call to the callbackfn function provides this value as an argument
    * instead of an array value.
    */
-  reduce<U>(
+  reduce<U = number>(
     callbackfn: (
       previousValue: U,
       currentValue: number,
       currentIndex: number,
-      array: Uint32Array
+      array: this
     ) => U,
     initialValue: U
   ): U;
-
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
    * the callbackfn function one time for each element in the array.
-   * @param initialValue If initialValue is specified, it is used as the initial value to start
-   * the accumulation. The first call to the callbackfn function provides this value as an
-   * argument instead of an array value.
    */
-  reduceRight(
+  reduceRight<U = number>(
     callbackfn: (
-      previousValue: number,
+      previousValue: number | U,
       currentValue: number,
       currentIndex: number,
-      array: Uint32Array
-    ) => number
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Uint32Array
-    ) => number,
-    initialValue: number
-  ): number;
-
+      array: this
+    ) => U
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -4482,14 +4327,14 @@
    * @param initialValue If initialValue is specified, it is used as the initial value to start
    * the accumulation. The first call to the callbackfn function provides this value as an argument
    * instead of an array value.
    */
-  reduceRight<U>(
+  reduceRight<U = number>(
     callbackfn: (
       previousValue: U,
       currentValue: number,
       currentIndex: number,
-      array: Uint32Array
+      array: this
     ) => U,
     initialValue: U
   ): U;
 
@@ -4510,20 +4355,24 @@
    * @param start The beginning of the specified portion of the array.
    * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
    */
   slice(start?: number, end?: number): Uint32Array;
-
   /**
    * Determines whether the specified callback function returns true for any element of an array.
    * @param predicate A function that accepts up to three arguments. The some method calls
    * the predicate function for each element in the array until the predicate returns a value
    * which is coercible to the Boolean value true, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  some(
-    predicate: (value: number, index: number, array: Uint32Array) => unknown,
-    thisArg?: any
+  some<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): boolean;
 
   /**
    * Sorts an array.
@@ -4558,9 +4407,8 @@
   valueOf(): Uint32Array;
 
   [index: number]: number;
 }
-
 interface Uint32ArrayConstructor {
   readonly prototype: Uint32Array;
   new (length: number): Uint32Array;
   new (array: ArrayLike<number> | ArrayBufferLike): Uint32Array;
@@ -4579,33 +4427,26 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Uint32Array;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like or iterable object to convert to an array.
+   * @param source An array-like or iterable object to convert to an array.
    */
-  from(arrayLike: ArrayLike<number>): Uint32Array;
-
+  from(source: ArrayLike<number>): Uint32Array;
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like or iterable object to convert to an array.
+   * @param source An array-like or iterable object to convert to an array.
    * @param mapfn A mapping function to call on every element of the array.
    * @param thisArg Value of 'this' used to invoke the mapfn.
    */
-  from<T>(
-    arrayLike: ArrayLike<T>,
-    mapfn: (v: T, k: number) => number,
-    thisArg?: any
+  from<T, This = undefined>(
+    source: ArrayLike<T>,
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This
   ): Uint32Array;
 }
 declare var Uint32Array: Uint32ArrayConstructor;
-
-/**
- * A typed array of 32-bit float values. The contents are initialized to 0. If the requested number
- * of bytes could not be allocated an exception is raised.
- */
 interface Float32Array {
   /**
    * The size in bytes of each element in the array.
    */
@@ -4635,20 +4476,24 @@
    * is treated as length+end.
    * @param end If not specified, length of the this object is used as its default value.
    */
   copyWithin(target: number, start: number, end?: number): this;
-
   /**
    * Determines whether all the members of an array satisfy the specified test.
    * @param predicate A function that accepts up to three arguments. The every method calls
    * the predicate function for each element in the array until the predicate returns a value
    * which is coercible to the Boolean value false, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  every(
-    predicate: (value: number, index: number, array: Float32Array) => unknown,
-    thisArg?: any
+  every<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): boolean;
 
   /**
    * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
@@ -4658,21 +4503,24 @@
    * @param end index to stop filling the array at. If end is negative, it is treated as
    * length+end.
    */
   fill(value: number, start?: number, end?: number): this;
-
   /**
    * Returns the elements of an array that meet the condition specified in a callback function.
    * @param predicate A function that accepts up to three arguments. The filter method calls
    * the predicate function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  filter(
-    predicate: (value: number, index: number, array: Float32Array) => any,
-    thisArg?: any
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): Float32Array;
-
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -4680,13 +4528,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (value: number, index: number, obj: Float32Array) => boolean,
-    thisArg?: any
+  find<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This
   ): number | undefined;
-
   /**
    * Returns the index of the first element in the array where predicate is true, and -1
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -4694,23 +4541,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (value: number, index: number, obj: Float32Array) => boolean,
-    thisArg?: any
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This
   ): number;
-
   /**
    * Performs the specified action for each element in an array.
    * @param callbackfn  A function that accepts up to three arguments. forEach calls the
    * callbackfn function one time for each element in the array.
    * @param thisArg  An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  forEach(
-    callbackfn: (value: number, index: number, array: Float32Array) => void,
-    thisArg?: any
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This
   ): void;
 
   /**
    * Returns the index of the first occurrence of a value in an array.
@@ -4738,50 +4584,40 @@
   /**
    * The length of the array.
    */
   readonly length: number;
-
   /**
    * Calls a defined callback function on each element of an array, and returns an array that
    * contains the results.
    * @param callbackfn A function that accepts up to three arguments. The map method calls the
    * callbackfn function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  map(
-    callbackfn: (value: number, index: number, array: Float32Array) => number,
-    thisArg?: any
+  map<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => number,
+    thisArg?: This
   ): Float32Array;
-
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
    * callbackfn function one time for each element in the array.
-   * @param initialValue If initialValue is specified, it is used as the initial value to start
-   * the accumulation. The first call to the callbackfn function provides this value as an argument
-   * instead of an array value.
    */
-  reduce(
+  reduce<U = number>(
     callbackfn: (
-      previousValue: number,
+      previousValue: number | U,
       currentValue: number,
       currentIndex: number,
-      array: Float32Array
-    ) => number
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Float32Array
-    ) => number,
-    initialValue: number
-  ): number;
-
+      array: this
+    ) => U
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -4790,46 +4626,32 @@
    * @param initialValue If initialValue is specified, it is used as the initial value to start
    * the accumulation. The first call to the callbackfn function provides this value as an argument
    * instead of an array value.
    */
-  reduce<U>(
+  reduce<U = number>(
     callbackfn: (
       previousValue: U,
       currentValue: number,
       currentIndex: number,
-      array: Float32Array
+      array: this
     ) => U,
     initialValue: U
   ): U;
-
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
    * the callbackfn function one time for each element in the array.
-   * @param initialValue If initialValue is specified, it is used as the initial value to start
-   * the accumulation. The first call to the callbackfn function provides this value as an
-   * argument instead of an array value.
    */
-  reduceRight(
+  reduceRight<U = number>(
     callbackfn: (
-      previousValue: number,
+      previousValue: number | U,
       currentValue: number,
       currentIndex: number,
-      array: Float32Array
-    ) => number
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Float32Array
-    ) => number,
-    initialValue: number
-  ): number;
-
+      array: this
+    ) => U
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -4838,14 +4660,14 @@
    * @param initialValue If initialValue is specified, it is used as the initial value to start
    * the accumulation. The first call to the callbackfn function provides this value as an argument
    * instead of an array value.
    */
-  reduceRight<U>(
+  reduceRight<U = number>(
     callbackfn: (
       previousValue: U,
       currentValue: number,
       currentIndex: number,
-      array: Float32Array
+      array: this
     ) => U,
     initialValue: U
   ): U;
 
@@ -4866,20 +4688,24 @@
    * @param start The beginning of the specified portion of the array.
    * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
    */
   slice(start?: number, end?: number): Float32Array;
-
   /**
    * Determines whether the specified callback function returns true for any element of an array.
    * @param predicate A function that accepts up to three arguments. The some method calls
    * the predicate function for each element in the array until the predicate returns a value
    * which is coercible to the Boolean value true, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  some(
-    predicate: (value: number, index: number, array: Float32Array) => unknown,
-    thisArg?: any
+  some<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): boolean;
 
   /**
    * Sorts an array.
@@ -4914,9 +4740,8 @@
   valueOf(): Float32Array;
 
   [index: number]: number;
 }
-
 interface Float32ArrayConstructor {
   readonly prototype: Float32Array;
   new (length: number): Float32Array;
   new (array: ArrayLike<number> | ArrayBufferLike): Float32Array;
@@ -4935,33 +4760,26 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Float32Array;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like or iterable object to convert to an array.
+   * @param source An array-like or iterable object to convert to an array.
    */
-  from(arrayLike: ArrayLike<number>): Float32Array;
-
+  from(source: ArrayLike<number>): Float32Array;
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like or iterable object to convert to an array.
+   * @param source An array-like or iterable object to convert to an array.
    * @param mapfn A mapping function to call on every element of the array.
    * @param thisArg Value of 'this' used to invoke the mapfn.
    */
-  from<T>(
-    arrayLike: ArrayLike<T>,
-    mapfn: (v: T, k: number) => number,
-    thisArg?: any
+  from<T, This = undefined>(
+    source: ArrayLike<T>,
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This
   ): Float32Array;
 }
 declare var Float32Array: Float32ArrayConstructor;
-
-/**
- * A typed array of 64-bit float values. The contents are initialized to 0. If the requested
- * number of bytes could not be allocated an exception is raised.
- */
 interface Float64Array {
   /**
    * The size in bytes of each element in the array.
    */
@@ -4991,20 +4809,24 @@
    * is treated as length+end.
    * @param end If not specified, length of the this object is used as its default value.
    */
   copyWithin(target: number, start: number, end?: number): this;
-
   /**
    * Determines whether all the members of an array satisfy the specified test.
    * @param predicate A function that accepts up to three arguments. The every method calls
    * the predicate function for each element in the array until the predicate returns a value
    * which is coercible to the Boolean value false, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  every(
-    predicate: (value: number, index: number, array: Float64Array) => unknown,
-    thisArg?: any
+  every<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): boolean;
 
   /**
    * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
@@ -5014,21 +4836,24 @@
    * @param end index to stop filling the array at. If end is negative, it is treated as
    * length+end.
    */
   fill(value: number, start?: number, end?: number): this;
-
   /**
    * Returns the elements of an array that meet the condition specified in a callback function.
    * @param predicate A function that accepts up to three arguments. The filter method calls
    * the predicate function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  filter(
-    predicate: (value: number, index: number, array: Float64Array) => any,
-    thisArg?: any
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): Float64Array;
-
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -5036,13 +4861,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (value: number, index: number, obj: Float64Array) => boolean,
-    thisArg?: any
+  find<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This
   ): number | undefined;
-
   /**
    * Returns the index of the first element in the array where predicate is true, and -1
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -5050,23 +4874,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (value: number, index: number, obj: Float64Array) => boolean,
-    thisArg?: any
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This
   ): number;
-
   /**
    * Performs the specified action for each element in an array.
    * @param callbackfn  A function that accepts up to three arguments. forEach calls the
    * callbackfn function one time for each element in the array.
    * @param thisArg  An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  forEach(
-    callbackfn: (value: number, index: number, array: Float64Array) => void,
-    thisArg?: any
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This
   ): void;
 
   /**
    * Returns the index of the first occurrence of a value in an array.
@@ -5094,50 +4917,40 @@
   /**
    * The length of the array.
    */
   readonly length: number;
-
   /**
    * Calls a defined callback function on each element of an array, and returns an array that
    * contains the results.
    * @param callbackfn A function that accepts up to three arguments. The map method calls the
    * callbackfn function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  map(
-    callbackfn: (value: number, index: number, array: Float64Array) => number,
-    thisArg?: any
+  map<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => number,
+    thisArg?: This
   ): Float64Array;
-
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
    * callbackfn function one time for each element in the array.
-   * @param initialValue If initialValue is specified, it is used as the initial value to start
-   * the accumulation. The first call to the callbackfn function provides this value as an argument
-   * instead of an array value.
    */
-  reduce(
+  reduce<U = number>(
     callbackfn: (
-      previousValue: number,
+      previousValue: number | U,
       currentValue: number,
       currentIndex: number,
-      array: Float64Array
-    ) => number
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Float64Array
-    ) => number,
-    initialValue: number
-  ): number;
-
+      array: this
+    ) => U
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -5146,46 +4959,32 @@
    * @param initialValue If initialValue is specified, it is used as the initial value to start
    * the accumulation. The first call to the callbackfn function provides this value as an argument
    * instead of an array value.
    */
-  reduce<U>(
+  reduce<U = number>(
     callbackfn: (
       previousValue: U,
       currentValue: number,
       currentIndex: number,
-      array: Float64Array
+      array: this
     ) => U,
     initialValue: U
   ): U;
-
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
    * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
    * the callbackfn function one time for each element in the array.
-   * @param initialValue If initialValue is specified, it is used as the initial value to start
-   * the accumulation. The first call to the callbackfn function provides this value as an
-   * argument instead of an array value.
    */
-  reduceRight(
+  reduceRight<U = number>(
     callbackfn: (
-      previousValue: number,
+      previousValue: number | U,
       currentValue: number,
       currentIndex: number,
-      array: Float64Array
-    ) => number
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Float64Array
-    ) => number,
-    initialValue: number
-  ): number;
-
+      array: this
+    ) => U
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -5194,14 +4993,14 @@
    * @param initialValue If initialValue is specified, it is used as the initial value to start
    * the accumulation. The first call to the callbackfn function provides this value as an argument
    * instead of an array value.
    */
-  reduceRight<U>(
+  reduceRight<U = number>(
     callbackfn: (
       previousValue: U,
       currentValue: number,
       currentIndex: number,
-      array: Float64Array
+      array: this
     ) => U,
     initialValue: U
   ): U;
 
@@ -5222,20 +5021,24 @@
    * @param start The beginning of the specified portion of the array.
    * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
    */
   slice(start?: number, end?: number): Float64Array;
-
   /**
    * Determines whether the specified callback function returns true for any element of an array.
    * @param predicate A function that accepts up to three arguments. The some method calls
    * the predicate function for each element in the array until the predicate returns a value
    * which is coercible to the Boolean value true, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  some(
-    predicate: (value: number, index: number, array: Float64Array) => unknown,
-    thisArg?: any
+  some<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this
+    ) => boolean,
+    thisArg?: This
   ): boolean;
 
   /**
    * Sorts an array.
@@ -5261,9 +5064,8 @@
   valueOf(): Float64Array;
 
   [index: number]: number;
 }
-
 interface Float64ArrayConstructor {
   readonly prototype: Float64Array;
   new (length: number): Float64Array;
   new (array: ArrayLike<number> | ArrayBufferLike): Float64Array;
@@ -5282,25 +5084,23 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Float64Array;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like or iterable object to convert to an array.
+   * @param source An array-like or iterable object to convert to an array.
    */
-  from(arrayLike: ArrayLike<number>): Float64Array;
-
+  from(source: ArrayLike<number>): Float64Array;
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like or iterable object to convert to an array.
+   * @param source An array-like or iterable object to convert to an array.
    * @param mapfn A mapping function to call on every element of the array.
    * @param thisArg Value of 'this' used to invoke the mapfn.
    */
-  from<T>(
-    arrayLike: ArrayLike<T>,
-    mapfn: (v: T, k: number) => number,
-    thisArg?: any
+  from<T, This = undefined>(
+    source: ArrayLike<T>,
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This
   ): Float64Array;
 }
 declare var Float64Array: Float64ArrayConstructor;
 
@@ -5434,9 +5234,8 @@
       options?: DateTimeFormatOptions
     ): string[];
   };
 }
-
 interface String {
   /**
    * Determines whether two strings are equivalent in the current or specified locale.
    * @param that String to compare to target string
@@ -5491,4 +5290,24 @@
     locales?: string | string[],
     options?: Intl.DateTimeFormatOptions
   ): string;
 }
+// --------------------
+type First<T> = T extends [any] ? T[0] : unknown;
+
+type UnionToIntersection<T> = (
+  T extends any ? (arg: T) => void : never
+) extends (arg: infer F) => void
+  ? F
+  : unknown;
+
+type CheckNonNullable<T, U> = [T] extends [NonNullable<T>] ? U : never;
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

```
