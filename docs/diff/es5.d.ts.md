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
@@ -358,47 +441,26 @@
     this: (this: T, ...args: A) => R,
     thisArg: T,
     ...args: A
   ): R;
+  /**
+   * For a given function, creates a bound function that has the same body as the original function.
+   * The this object of the bound function is associated with the specified object, and has the specified initial parameters.
+   * @param thisArg The object to be used as the this object.
+   */
+  bind<T>(this: T, thisArg: ThisParameterType<T>): OmitThisParameter<T>;
 
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
 
 interface NewableFunction extends Function {
   /**
@@ -422,51 +484,30 @@
     this: new (...args: A) => T,
     thisArg: T,
     ...args: A
   ): void;
+  /**
+   * For a given function, creates a bound function that has the same body as the original function.
+   * The this object of the bound function is associated with the specified object, and has the specified initial parameters.
+   * @param thisArg The object to be used as the this object.
+   */
+  bind<T>(this: T, thisArg: any): T;
 
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
 
 interface IArguments {
-  [index: number]: any;
+  [index: number]: unknown;
   length: number;
   callee: Function;
 }
 
@@ -516,24 +557,28 @@
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
@@ -1221,37 +1266,65 @@
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
@@ -1315,23 +1388,25 @@
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
@@ -1339,117 +1414,99 @@
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
 
@@ -1573,23 +1630,25 @@
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
@@ -1597,133 +1656,113 @@
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
 
@@ -1737,9 +1776,11 @@
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
 
@@ -1749,52 +1790,56 @@
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
@@ -2144,20 +2189,24 @@
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
@@ -2167,21 +2216,24 @@
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
@@ -2189,13 +2241,12 @@
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
@@ -2203,23 +2254,22 @@
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
@@ -2247,50 +2297,40 @@
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
@@ -2299,46 +2339,32 @@
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
@@ -2347,14 +2373,14 @@
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
 
@@ -2375,20 +2401,24 @@
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
@@ -2443,25 +2473,23 @@
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
 
@@ -2499,20 +2527,24 @@
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
@@ -2522,21 +2554,24 @@
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
@@ -2544,13 +2579,12 @@
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
@@ -2558,23 +2592,22 @@
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
@@ -2602,50 +2635,40 @@
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
@@ -2654,46 +2677,32 @@
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
@@ -2702,14 +2711,14 @@
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
 
@@ -2730,20 +2739,24 @@
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
@@ -2799,25 +2812,23 @@
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
 
@@ -2855,24 +2866,24 @@
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
@@ -2882,21 +2893,24 @@
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
@@ -2904,17 +2918,12 @@
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
@@ -2922,31 +2931,22 @@
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
@@ -2974,54 +2974,40 @@
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
@@ -3030,46 +3016,32 @@
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
@@ -3078,14 +3050,14 @@
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
 
@@ -3106,24 +3078,24 @@
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
@@ -3179,25 +3151,23 @@
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
 
@@ -3235,20 +3205,24 @@
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
@@ -3258,21 +3232,24 @@
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
@@ -3280,13 +3257,12 @@
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
@@ -3294,23 +3270,22 @@
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
@@ -3337,50 +3312,40 @@
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
@@ -3389,46 +3354,32 @@
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
@@ -3437,14 +3388,14 @@
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
 
@@ -3465,20 +3416,24 @@
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
@@ -3534,25 +3489,23 @@
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
 
@@ -3590,20 +3543,24 @@
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
@@ -3613,21 +3570,24 @@
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
@@ -3635,13 +3595,12 @@
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
@@ -3649,23 +3608,22 @@
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
@@ -3693,50 +3651,40 @@
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
@@ -3745,46 +3693,32 @@
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
@@ -3793,14 +3727,14 @@
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
 
@@ -3821,20 +3755,24 @@
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
@@ -3890,25 +3828,23 @@
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
@@ -3945,20 +3881,24 @@
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
@@ -3968,21 +3908,24 @@
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
@@ -3990,13 +3933,12 @@
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
@@ -4004,23 +3946,22 @@
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
@@ -4048,50 +3989,40 @@
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
@@ -4100,46 +4031,32 @@
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
@@ -4148,14 +4065,14 @@
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
 
@@ -4176,20 +4093,24 @@
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
@@ -4245,25 +4166,23 @@
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
 
@@ -4301,20 +4220,24 @@
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
@@ -4324,21 +4247,24 @@
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
@@ -4346,13 +4272,12 @@
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
@@ -4360,23 +4285,22 @@
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
@@ -4403,50 +4327,40 @@
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
@@ -4455,46 +4369,32 @@
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
@@ -4503,14 +4403,14 @@
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
 
@@ -4531,20 +4431,24 @@
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
@@ -4600,25 +4504,23 @@
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
 
@@ -4656,20 +4558,24 @@
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
@@ -4679,21 +4585,24 @@
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
@@ -4701,13 +4610,12 @@
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
@@ -4715,23 +4623,22 @@
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
@@ -4759,50 +4666,40 @@
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
@@ -4811,46 +4708,32 @@
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
@@ -4859,14 +4742,14 @@
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
 
@@ -4887,20 +4770,24 @@
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
@@ -4956,25 +4843,23 @@
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
 
@@ -5012,20 +4897,24 @@
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
@@ -5035,21 +4924,24 @@
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
@@ -5057,13 +4949,12 @@
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
@@ -5071,23 +4962,22 @@
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
@@ -5115,50 +5005,40 @@
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
@@ -5167,46 +5047,32 @@
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
@@ -5215,14 +5081,14 @@
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
 
@@ -5243,20 +5109,24 @@
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
@@ -5303,25 +5173,23 @@
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
 
@@ -5521,4 +5389,33 @@
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
