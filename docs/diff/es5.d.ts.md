# es5.d.ts Diffs

```diff
Index: es5.d.ts
===================================================================
--- es5.d.ts
+++ es5.d.ts
@@ -11,9 +11,9 @@
 /**
  * Evaluates JavaScript code and executes it.
  * @param x A String value that contains valid JavaScript code.
  */
-declare function eval(x: string): any;
+declare function eval(x: string): unknown;
 
 /**
  * Converts a string to an integer.
  * @param string A string to convert into a number.
@@ -115,14 +115,27 @@
   toLocaleString(): string;
 
   /** Returns the primitive value of the specified object. */
   valueOf(): Object;
-
   /**
    * Determines whether an object has a property with the specified name.
    * @param v A property name.
    */
-  hasOwnProperty(v: PropertyKey): boolean;
+  hasOwnProperty<Obj, Key extends PropertyKey>(
+    this: Obj,
+    v: Key
+  ): this is Obj &
+    (string extends Key
+      ? {}
+      : number extends Key
+      ? {}
+      : symbol extends Key
+      ? {}
+      : Key extends PropertyKey
+      ? {
+          [key in Key]: unknown;
+        }
+      : {});
 
   /**
    * Determines whether an object exists in another object's prototype chain.
    * @param v Another object whose prototype chain is to be checked.
@@ -137,75 +150,145 @@
 }
 
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
+  getPrototypeOf(o: {}): unknown;
 
   /**
    * Gets the own property descriptor of the specified object.
    * An own property descriptor is one that is defined directly on the object and is not inherited from the object's prototype.
    * @param o Object that contains the property.
    * @param p Name of the property.
    */
   getOwnPropertyDescriptor(
-    o: any,
+    o: {},
     p: PropertyKey
   ): PropertyDescriptor | undefined;
 
   /**
    * Returns the names of the own properties of an object. The own properties of an object are those that are defined directly
    * on that object, and are not inherited from the object's prototype. The properties of an object include both fields (objects) and functions.
    * @param o Object that contains the own properties.
    */
-  getOwnPropertyNames(o: any): string[];
+  getOwnPropertyNames(o: {}): string[];
 
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
@@ -363,9 +446,8 @@
     this: (this: T, ...args: A) => R,
     thisArg: T,
     ...args: A
   ): R;
-
   /**
    * For a given function, creates a bound function that has the same body as the original function.
    * The this object of the bound function is associated with the specified object, and has the specified initial parameters.
    * @param thisArg The object to be used as the this object.
@@ -377,9 +459,9 @@
    * The this object of the bound function is associated with the specified object, and has the specified initial parameters.
    * @param thisArg The object to be used as the this object.
    * @param args Arguments to bind to the parameters of the function.
    */
-  bind<T, A extends any[], B extends any[], R>(
+  bind<T, A extends readonly any[], B extends readonly any[], R>(
     this: (this: T, ...args: [...A, ...B]) => R,
     thisArg: T,
     ...args: A
   ): (...args: B) => R;
@@ -411,9 +493,8 @@
     this: new (...args: A) => T,
     thisArg: T,
     ...args: A
   ): void;
-
   /**
    * For a given function, creates a bound function that has the same body as the original function.
    * The this object of the bound function is associated with the specified object, and has the specified initial parameters.
    * @param thisArg The object to be used as the this object.
@@ -425,17 +506,17 @@
    * The this object of the bound function is associated with the specified object, and has the specified initial parameters.
    * @param thisArg The object to be used as the this object.
    * @param args Arguments to bind to the parameters of the function.
    */
-  bind<A extends any[], B extends any[], R>(
+  bind<A extends readonly any[], B extends readonly any[], R>(
     this: new (...args: [...A, ...B]) => R,
     thisArg: any,
     ...args: A
   ): new (...args: B) => R;
 }
 
 interface IArguments {
-  [index: number]: any;
+  [index: number]: unknown;
   length: number;
   callee: Function;
 }
 
@@ -485,24 +566,28 @@
    * Matches a string with a regular expression, and returns an array containing the results of that search.
    * @param regexp A variable name or string literal containing the regular expression pattern and flags.
    */
   match(regexp: string | RegExp): RegExpMatchArray | null;
-
   /**
    * Replaces text in a string, using a regular expression or search string.
-   * @param searchValue A string or regular expression to search for.
-   * @param replaceValue A string containing the text to replace. When the {@linkcode searchValue} is a `RegExp`, all matches are replaced if the `g` flag is set (or only those matches at the beginning, if the `y` flag is also present). Otherwise, only the first match of {@linkcode searchValue} is replaced.
+   * @param searchValue A string or RegExp search value.
+   * @param replaceValue A string containing the text to replace for every successful match of searchValue in this string.
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
@@ -1198,37 +1283,65 @@
 interface JSON {
   /**
    * Converts a JavaScript Object Notation (JSON) string into an object.
    * @param text A valid JSON string.
+   */
+  parse(text: string): JSONValue;
+  /**
+   * Converts a JavaScript Object Notation (JSON) string into an object.
+   * @param text A valid JSON string.
    * @param reviver A function that transforms the results. This function is called for each member of the object.
    * If a member contains nested objects, the nested objects are transformed before the parent object is.
    */
-  parse(
+  parse<A = unknown>(
     text: string,
-    reviver?: (this: any, key: string, value: any) => any
-  ): any;
+    reviver: <K extends string>(
+      this: JSONHolder<K, A>,
+      key: K,
+      value: JSONValueF<A>
+    ) => A
+  ): A;
   /**
    * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
    * @param value A JavaScript value, usually an object or array, to be converted.
+   * @param replacer An array of strings and numbers that acts as an approved list for selecting the object properties that will be stringified.
+   * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
+   */
+  stringify<A>(
+    value: A,
+    replacer?: (string | number)[] | null | undefined,
+    space?: string | number | null | undefined
+  ): StringifyResult<ToJSON<A>>;
+  /**
+   * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
+   * @param value A JavaScript value, usually an object or array, to be converted.
    * @param replacer A function that transforms the results.
    * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
    */
-  stringify(
-    value: any,
-    replacer?: (this: any, key: string, value: any) => any,
-    space?: string | number
+  stringify<A>(
+    value: A,
+    replacer: (
+      this: JSONComposite<A>,
+      key: string,
+      value: ToJSON<A>
+    ) => JSONValueF<A>,
+    space?: string | number | null | undefined
   ): string;
   /**
    * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
    * @param value A JavaScript value, usually an object or array, to be converted.
-   * @param replacer An array of strings and numbers that acts as an approved list for selecting the object properties that will be stringified.
+   * @param replacer A function that transforms the results.
    * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
    */
-  stringify(
-    value: any,
-    replacer?: (number | string)[] | null,
-    space?: string | number
-  ): string;
+  stringify<A>(
+    value: A,
+    replacer: (
+      this: JSONComposite<A>,
+      key: string,
+      value: ToJSON<A>
+    ) => JSONValueF<A> | undefined,
+    space?: string | number | null | undefined
+  ): string | undefined;
 }
 
 /**
  * An intrinsic object that provides functions to convert JavaScript values to and from the JavaScript Object Notation (JSON) format.
@@ -1292,23 +1405,25 @@
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
@@ -1316,117 +1431,102 @@
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
+  ): Cast<
+    {
+      -readonly [K in keyof this]: U;
+    },
+    U[]
+  >;
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
 
@@ -1550,23 +1650,25 @@
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
@@ -1574,133 +1676,116 @@
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
+  ): Cast<
+    {
+      [K in keyof this]: U;
+    },
+    U[]
+  >;
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
 
@@ -1714,9 +1799,11 @@
 }
 
 declare type PromiseConstructorLike = new <T>(
   executor: (
-    resolve: (value: T | PromiseLike<T>) => void,
+    resolve: undefined extends T
+      ? (value?: T | PromiseLike<T>) => void
+      : (value: T | PromiseLike<T>) => void,
     reject: (reason?: any) => void
   ) => void
 ) => PromiseLike<T>;
 
@@ -1726,52 +1813,56 @@
    * @param onfulfilled The callback to execute when the Promise is resolved.
    * @param onrejected The callback to execute when the Promise is rejected.
    * @returns A Promise for the completion of which ever callback is executed.
    */
-  then<TResult1 = T, TResult2 = never>(
-    onfulfilled?:
-      | ((value: T) => TResult1 | PromiseLike<TResult1>)
-      | undefined
-      | null,
-    onrejected?:
-      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
-      | undefined
-      | null
-  ): PromiseLike<TResult1 | TResult2>;
+  then(
+    onfulfilled?: null | undefined,
+    onrejected?: ((reason: unknown) => T | PromiseLike<T>) | null | undefined
+  ): PromiseLike<T>;
+
+  /**
+   * Attaches callbacks for the resolution and/or rejection of the Promise.
+   * @param onfulfilled The callback to execute when the Promise is resolved.
+   * @param onrejected The callback to execute when the Promise is rejected.
+   * @returns A Promise for the completion of which ever callback is executed.
+   */
+  then<U>(
+    onfulfilled: (value: T) => U | PromiseLike<U>,
+    onrejected?: ((reason: unknown) => U | PromiseLike<U>) | null | undefined
+  ): PromiseLike<U>;
 }
 
-/**
- * Represents the completion of an asynchronous operation
- */
-interface Promise<T> {
+interface Promise<T> extends PromiseLike<T> {
   /**
    * Attaches callbacks for the resolution and/or rejection of the Promise.
    * @param onfulfilled The callback to execute when the Promise is resolved.
    * @param onrejected The callback to execute when the Promise is rejected.
    * @returns A Promise for the completion of which ever callback is executed.
    */
-  then<TResult1 = T, TResult2 = never>(
-    onfulfilled?:
-      | ((value: T) => TResult1 | PromiseLike<TResult1>)
-      | undefined
-      | null,
-    onrejected?:
-      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
-      | undefined
-      | null
-  ): Promise<TResult1 | TResult2>;
+  then(
+    onfulfilled?: null | undefined,
+    onrejected?: ((reason: unknown) => T | PromiseLike<T>) | null | undefined
+  ): Promise<T>;
 
   /**
+   * Attaches callbacks for the resolution and/or rejection of the Promise.
+   * @param onfulfilled The callback to execute when the Promise is resolved.
+   * @param onrejected The callback to execute when the Promise is rejected.
+   * @returns A Promise for the completion of which ever callback is executed.
+   */
+  then<U>(
+    onfulfilled: (value: T) => U | PromiseLike<U>,
+    onrejected?: ((reason: unknown) => U | PromiseLike<U>) | null | undefined
+  ): Promise<U>;
+
+  /**
    * Attaches a callback for only the rejection of the Promise.
    * @param onrejected The callback to execute when the Promise is rejected.
    * @returns A Promise for the completion of the callback.
    */
-  catch<TResult = never>(
-    onrejected?:
-      | ((reason: any) => TResult | PromiseLike<TResult>)
-      | undefined
-      | null
-  ): Promise<T | TResult>;
+  catch(
+    onrejected?: ((reason: unknown) => T | PromiseLike<T>) | null | undefined
+  ): Promise<T>;
 }
 
 /**
  * Recursively unwraps the "awaited type" of a type. Non-promise "thenables" should resolve to `never`. This emulates the behavior of `await`.
@@ -2130,20 +2221,24 @@
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
@@ -2153,21 +2248,24 @@
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
@@ -2175,13 +2273,12 @@
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
@@ -2189,23 +2286,22 @@
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
@@ -2233,50 +2329,40 @@
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
@@ -2285,46 +2371,32 @@
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
@@ -2333,14 +2405,14 @@
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
 
@@ -2361,20 +2433,24 @@
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
@@ -2429,25 +2505,23 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Int8Array;
-
   /**
    * Creates an array from an array-like or iterable object.
    * @param arrayLike An array-like or iterable object to convert to an array.
    */
   from(arrayLike: ArrayLike<number>): Int8Array;
-
   /**
    * Creates an array from an array-like or iterable object.
    * @param arrayLike An array-like or iterable object to convert to an array.
    * @param mapfn A mapping function to call on every element of the array.
    * @param thisArg Value of 'this' used to invoke the mapfn.
    */
-  from<T>(
+  from<T, This = undefined>(
     arrayLike: ArrayLike<T>,
-    mapfn: (v: T, k: number) => number,
-    thisArg?: any
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This
   ): Int8Array;
 }
 declare var Int8Array: Int8ArrayConstructor;
 
@@ -2485,20 +2559,24 @@
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
@@ -2508,21 +2586,24 @@
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
@@ -2530,13 +2611,12 @@
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
@@ -2544,23 +2624,22 @@
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
@@ -2588,50 +2667,40 @@
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
@@ -2640,46 +2709,32 @@
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
@@ -2688,14 +2743,14 @@
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
 
@@ -2716,20 +2771,24 @@
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
@@ -2785,25 +2844,23 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Uint8Array;
-
   /**
    * Creates an array from an array-like or iterable object.
    * @param arrayLike An array-like or iterable object to convert to an array.
    */
   from(arrayLike: ArrayLike<number>): Uint8Array;
-
   /**
    * Creates an array from an array-like or iterable object.
    * @param arrayLike An array-like or iterable object to convert to an array.
    * @param mapfn A mapping function to call on every element of the array.
    * @param thisArg Value of 'this' used to invoke the mapfn.
    */
-  from<T>(
+  from<T, This = undefined>(
     arrayLike: ArrayLike<T>,
-    mapfn: (v: T, k: number) => number,
-    thisArg?: any
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This
   ): Uint8Array;
 }
 declare var Uint8Array: Uint8ArrayConstructor;
 
@@ -2841,24 +2898,24 @@
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
@@ -2868,21 +2925,24 @@
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
@@ -2890,17 +2950,12 @@
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
@@ -2908,31 +2963,22 @@
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
@@ -2960,54 +3006,40 @@
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
@@ -3016,46 +3048,32 @@
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
@@ -3064,14 +3082,14 @@
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
 
@@ -3092,24 +3110,24 @@
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
@@ -3165,25 +3183,23 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Uint8ClampedArray;
-
   /**
    * Creates an array from an array-like or iterable object.
    * @param arrayLike An array-like or iterable object to convert to an array.
    */
   from(arrayLike: ArrayLike<number>): Uint8ClampedArray;
-
   /**
    * Creates an array from an array-like or iterable object.
    * @param arrayLike An array-like or iterable object to convert to an array.
    * @param mapfn A mapping function to call on every element of the array.
    * @param thisArg Value of 'this' used to invoke the mapfn.
    */
-  from<T>(
+  from<T, This = undefined>(
     arrayLike: ArrayLike<T>,
-    mapfn: (v: T, k: number) => number,
-    thisArg?: any
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This
   ): Uint8ClampedArray;
 }
 declare var Uint8ClampedArray: Uint8ClampedArrayConstructor;
 
@@ -3221,20 +3237,24 @@
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
@@ -3244,21 +3264,24 @@
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
@@ -3266,13 +3289,12 @@
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
@@ -3280,23 +3302,22 @@
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
@@ -3323,50 +3344,40 @@
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
@@ -3375,46 +3386,32 @@
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
@@ -3423,14 +3420,14 @@
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
 
@@ -3451,20 +3448,24 @@
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
@@ -3520,25 +3521,23 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Int16Array;
-
   /**
    * Creates an array from an array-like or iterable object.
    * @param arrayLike An array-like or iterable object to convert to an array.
    */
   from(arrayLike: ArrayLike<number>): Int16Array;
-
   /**
    * Creates an array from an array-like or iterable object.
    * @param arrayLike An array-like or iterable object to convert to an array.
    * @param mapfn A mapping function to call on every element of the array.
    * @param thisArg Value of 'this' used to invoke the mapfn.
    */
-  from<T>(
+  from<T, This = undefined>(
     arrayLike: ArrayLike<T>,
-    mapfn: (v: T, k: number) => number,
-    thisArg?: any
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This
   ): Int16Array;
 }
 declare var Int16Array: Int16ArrayConstructor;
 
@@ -3576,20 +3575,24 @@
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
@@ -3599,21 +3602,24 @@
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
@@ -3621,13 +3627,12 @@
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
@@ -3635,23 +3640,22 @@
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
@@ -3679,50 +3683,40 @@
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
@@ -3731,46 +3725,32 @@
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
@@ -3779,14 +3759,14 @@
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
 
@@ -3807,20 +3787,24 @@
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
@@ -3876,25 +3860,23 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Uint16Array;
-
   /**
    * Creates an array from an array-like or iterable object.
    * @param arrayLike An array-like or iterable object to convert to an array.
    */
   from(arrayLike: ArrayLike<number>): Uint16Array;
-
   /**
    * Creates an array from an array-like or iterable object.
    * @param arrayLike An array-like or iterable object to convert to an array.
    * @param mapfn A mapping function to call on every element of the array.
    * @param thisArg Value of 'this' used to invoke the mapfn.
    */
-  from<T>(
+  from<T, This = undefined>(
     arrayLike: ArrayLike<T>,
-    mapfn: (v: T, k: number) => number,
-    thisArg?: any
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This
   ): Uint16Array;
 }
 declare var Uint16Array: Uint16ArrayConstructor;
 /**
@@ -3931,20 +3913,24 @@
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
@@ -3954,21 +3940,24 @@
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
@@ -3976,13 +3965,12 @@
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
@@ -3990,23 +3978,22 @@
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
@@ -4034,50 +4021,40 @@
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
@@ -4086,46 +4063,32 @@
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
@@ -4134,14 +4097,14 @@
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
 
@@ -4162,20 +4125,24 @@
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
@@ -4231,25 +4198,23 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Int32Array;
-
   /**
    * Creates an array from an array-like or iterable object.
    * @param arrayLike An array-like or iterable object to convert to an array.
    */
   from(arrayLike: ArrayLike<number>): Int32Array;
-
   /**
    * Creates an array from an array-like or iterable object.
    * @param arrayLike An array-like or iterable object to convert to an array.
    * @param mapfn A mapping function to call on every element of the array.
    * @param thisArg Value of 'this' used to invoke the mapfn.
    */
-  from<T>(
+  from<T, This = undefined>(
     arrayLike: ArrayLike<T>,
-    mapfn: (v: T, k: number) => number,
-    thisArg?: any
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This
   ): Int32Array;
 }
 declare var Int32Array: Int32ArrayConstructor;
 
@@ -4287,20 +4252,24 @@
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
@@ -4310,21 +4279,24 @@
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
@@ -4332,13 +4304,12 @@
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
@@ -4346,23 +4317,22 @@
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
@@ -4389,50 +4359,40 @@
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
@@ -4441,46 +4401,32 @@
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
@@ -4489,14 +4435,14 @@
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
 
@@ -4517,20 +4463,24 @@
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
@@ -4586,25 +4536,23 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Uint32Array;
-
   /**
    * Creates an array from an array-like or iterable object.
    * @param arrayLike An array-like or iterable object to convert to an array.
    */
   from(arrayLike: ArrayLike<number>): Uint32Array;
-
   /**
    * Creates an array from an array-like or iterable object.
    * @param arrayLike An array-like or iterable object to convert to an array.
    * @param mapfn A mapping function to call on every element of the array.
    * @param thisArg Value of 'this' used to invoke the mapfn.
    */
-  from<T>(
+  from<T, This = undefined>(
     arrayLike: ArrayLike<T>,
-    mapfn: (v: T, k: number) => number,
-    thisArg?: any
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This
   ): Uint32Array;
 }
 declare var Uint32Array: Uint32ArrayConstructor;
 
@@ -4642,20 +4590,24 @@
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
@@ -4665,21 +4617,24 @@
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
@@ -4687,13 +4642,12 @@
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
@@ -4701,23 +4655,22 @@
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
@@ -4745,50 +4698,40 @@
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
@@ -4797,46 +4740,32 @@
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
@@ -4845,14 +4774,14 @@
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
 
@@ -4873,20 +4802,24 @@
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
@@ -4942,25 +4875,23 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Float32Array;
-
   /**
    * Creates an array from an array-like or iterable object.
    * @param arrayLike An array-like or iterable object to convert to an array.
    */
   from(arrayLike: ArrayLike<number>): Float32Array;
-
   /**
    * Creates an array from an array-like or iterable object.
    * @param arrayLike An array-like or iterable object to convert to an array.
    * @param mapfn A mapping function to call on every element of the array.
    * @param thisArg Value of 'this' used to invoke the mapfn.
    */
-  from<T>(
+  from<T, This = undefined>(
     arrayLike: ArrayLike<T>,
-    mapfn: (v: T, k: number) => number,
-    thisArg?: any
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This
   ): Float32Array;
 }
 declare var Float32Array: Float32ArrayConstructor;
 
@@ -4998,20 +4929,24 @@
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
@@ -5021,21 +4956,24 @@
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
@@ -5043,13 +4981,12 @@
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
@@ -5057,23 +4994,22 @@
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
@@ -5101,50 +5037,40 @@
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
@@ -5153,46 +5079,32 @@
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
@@ -5201,14 +5113,14 @@
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
 
@@ -5229,20 +5141,24 @@
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
@@ -5298,25 +5214,23 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Float64Array;
-
   /**
    * Creates an array from an array-like or iterable object.
    * @param arrayLike An array-like or iterable object to convert to an array.
    */
   from(arrayLike: ArrayLike<number>): Float64Array;
-
   /**
    * Creates an array from an array-like or iterable object.
    * @param arrayLike An array-like or iterable object to convert to an array.
    * @param mapfn A mapping function to call on every element of the array.
    * @param thisArg Value of 'this' used to invoke the mapfn.
    */
-  from<T>(
+  from<T, This = undefined>(
     arrayLike: ArrayLike<T>,
-    mapfn: (v: T, k: number) => number,
-    thisArg?: any
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This
   ): Float64Array;
 }
 declare var Float64Array: Float64ArrayConstructor;
 
@@ -5535,4 +5449,33 @@
     locales?: string | string[],
     options?: Intl.DateTimeFormatOptions
   ): string;
 }
+// --------------------
+type Cast<T, U> = T extends U ? T : U;
+
+/**
+ * Make all properties in T writable
+ */
+type Writable<T> = {
+  -readonly [P in keyof T]: T[P];
+};
+
+type Intersect<T extends readonly any[]> = ((
+  ...args: { [K in keyof T]: Cast<Writable<T[K]>, {}> }
+) => void) extends (...args: { [K in keyof T]: infer S }) => void
+  ? S
+  : never;
+
+type JSONPrimitive = string | number | boolean | null;
+type JSONComposite<A> = Record<string, A> | A[];
+type JSONValueF<A> = JSONPrimitive | JSONComposite<A>;
+type JSONValue = JSONPrimitive | JSONObject | JSONValue[];
+type JSONObject = { [key: string]: JSONValue };
+type JSONHolder<K extends string, A> = Record<K, JSONValueF<A>>;
+type ToJSON<A> = A extends { toJSON(...args: any): infer T } ? T : A;
+type SomeExtends<A, B> = A extends B ? undefined : never;
+type SomeFunction = (...args: any) => any;
+type SomeConstructor = new (...args: any) => any;
+type UndefinedDomain = symbol | SomeFunction | SomeConstructor | undefined;
+type StringifyResultT<A> = A extends UndefinedDomain ? undefined : string;
+type StringifyResult<A> = StringifyResultT<A> | SomeExtends<UndefinedDomain, A>;

```
