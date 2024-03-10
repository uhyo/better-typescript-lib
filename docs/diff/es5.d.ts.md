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
+    v: Key,
+  ): this is Obj &
+    (string extends Key
+      ? {}
+      : number extends Key
+        ? {}
+        : symbol extends Key
+          ? {}
+          : Key extends PropertyKey
+            ? {
+                [key in Key]: unknown;
+              }
+            : {});
 
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
     p: PropertyKey,
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
-    properties: PropertyDescriptorMap & ThisType<any>,
-  ): any;
+  create<O extends object, P extends Record<PropertyKey, PropertyDescriptor>>(
+    o: O,
+    properties: P & ThisType<any>,
+  ): {
+    [K in keyof (O & P)]: P[K] extends {
+      value: infer V;
+    }
+      ? V
+      : P[K] extends {
+            get: () => infer V;
+          }
+        ? V
+        : K extends keyof O
+          ? O[K]
+          : unknown;
+  };
 
   /**
+   * Creates an object that has the specified prototype, and that optionally contains specified properties.
+   * @param o Object to use as a prototype. May be null
+   * @param properties JavaScript object that contains one or more property descriptors.
+   */
+  create<P extends Record<string, PropertyDescriptor>>(
+    o: null,
+    properties: P & ThisType<any>,
+  ): {
+    [K in keyof P]: P[K] extends {
+      value: infer V;
+    }
+      ? V
+      : P[K] extends {
+            get: () => infer V;
+          }
+        ? V
+        : unknown;
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
-    attributes: PropertyDescriptor & ThisType<any>,
-  ): T;
+  defineProperty<
+    O extends object,
+    P extends PropertyKey,
+    D extends PropertyDescriptor,
+  >(
+    o: O,
+    p: P,
+    attributes: D & ThisType<any>,
+  ): O &
+    (P extends PropertyKey // required to make P distributive
+      ? {
+          [K in P]: D extends {
+            value: infer V;
+          }
+            ? V
+            : D extends {
+                  get: () => infer V;
+                }
+              ? V
+              : unknown;
+        }
+      : unknown);
 
   /**
    * Adds one or more properties to an object, and/or modifies attributes of existing properties.
    * @param o Object on which to add or modify the properties. This can be a native JavaScript object or a DOM object.
    * @param properties JavaScript object that contains one or more descriptor objects. Each descriptor object describes a data property or an accessor property.
    */
-  defineProperties<T>(
-    o: T,
-    properties: PropertyDescriptorMap & ThisType<any>,
-  ): T;
+  defineProperties<
+    O extends object,
+    P extends Record<PropertyKey, PropertyDescriptor>,
+  >(
+    o: O,
+    properties: P & ThisType<any>,
+  ): {
+    [K in keyof (O & P)]: P[K] extends {
+      value: infer V;
+    }
+      ? V
+      : P[K] extends {
+            get: () => infer V;
+          }
+        ? V
+        : K extends keyof O
+          ? O[K]
+          : unknown;
+  };
 
   /**
    * Prevents the modification of attributes of existing properties, and prevents the addition of new properties.
    * @param o Object on which to lock the attributes.
@@ -364,9 +447,8 @@
     this: (this: T, ...args: A) => R,
     thisArg: T,
     ...args: A
   ): R;
-
   /**
    * For a given function, creates a bound function that has the same body as the original function.
    * The this object of the bound function is associated with the specified object, and has the specified initial parameters.
    * @param thisArg The object to be used as the this object.
@@ -378,9 +460,9 @@
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
@@ -412,9 +494,8 @@
     this: new (...args: A) => T,
     thisArg: T,
     ...args: A
   ): void;
-
   /**
    * For a given function, creates a bound function that has the same body as the original function.
    * The this object of the bound function is associated with the specified object, and has the specified initial parameters.
    * @param thisArg The object to be used as the this object.
@@ -426,17 +507,17 @@
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
 
@@ -486,24 +567,28 @@
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
-    replacer: (substring: string, ...args: any[]) => string,
+    replacer: (
+      substring: string,
+      // TODO: could be improved, but blocked by issue:
+      // https://github.com/microsoft/TypeScript/issues/45972
+      ...rest: (string | number)[]
+    ) => string,
   ): string;
 
   /**
    * Finds the first substring match in a regular expression search.
@@ -1199,37 +1284,65 @@
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
-    reviver?: (this: any, key: string, value: any) => any,
-  ): any;
+    reviver: <K extends string>(
+      this: JSONHolder<K, A>,
+      key: K,
+      value: JSONValueF<A>,
+    ) => A,
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
+    space?: string | number | null | undefined,
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
-    space?: string | number,
+  stringify<A>(
+    value: A,
+    replacer: (
+      this: JSONComposite<A>,
+      key: string,
+      value: ToJSON<A>,
+    ) => JSONValueF<A>,
+    space?: string | number | null | undefined,
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
-    space?: string | number,
-  ): string;
+  stringify<A>(
+    value: A,
+    replacer: (
+      this: JSONComposite<A>,
+      key: string,
+      value: ToJSON<A>,
+    ) => JSONValueF<A> | undefined,
+    space?: string | number | null | undefined,
+  ): string | undefined;
 }
 
 /**
  * An intrinsic object that provides functions to convert JavaScript values to and from the JavaScript Object Notation (JSON) format.
@@ -1293,23 +1406,25 @@
    * which is coercible to the Boolean value false, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  every<S extends T>(
-    predicate: (value: T, index: number, array: readonly T[]) => value is S,
-    thisArg?: any,
-  ): this is readonly S[];
+  every<S extends T, This = undefined>(
+    predicate: (this: This, value: T, index: number, array: this) => value is S,
+    thisArg?: This,
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
-    thisArg?: any,
+  every<This = undefined>(
+    predicate: (this: This, value: T, index: number, array: this) => boolean,
+    thisArg?: This,
   ): boolean;
   /**
    * Determines whether the specified callback function returns true for any element of an array.
    * @param predicate A function that accepts up to three arguments. The some method calls
@@ -1317,117 +1432,102 @@
    * which is coercible to the Boolean value true, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  some(
-    predicate: (value: T, index: number, array: readonly T[]) => unknown,
-    thisArg?: any,
+  some<This = undefined>(
+    predicate: (this: This, value: T, index: number, array: this) => boolean,
+    thisArg?: This,
   ): boolean;
   /**
    * Performs the specified action for each element in an array.
    * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
    * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
    */
-  forEach(
-    callbackfn: (value: T, index: number, array: readonly T[]) => void,
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: T, index: number, array: this) => void,
+    thisArg?: This,
   ): void;
   /**
    * Calls a defined callback function on each element of an array, and returns an array that contains the results.
    * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
    */
-  map<U>(
-    callbackfn: (value: T, index: number, array: readonly T[]) => U,
-    thisArg?: any,
-  ): U[];
+  map<U, This = undefined>(
+    callbackfn: (this: This, value: T, index: number, array: this) => U,
+    thisArg?: This,
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
-    thisArg?: any,
+  filter<S extends T, This = undefined>(
+    predicate: (this: This, value: T, index: number, array: this) => value is S,
+    thisArg?: This,
   ): S[];
   /**
    * Returns the elements of an array that meet the condition specified in a callback function.
    * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
    */
-  filter(
-    predicate: (value: T, index: number, array: readonly T[]) => unknown,
-    thisArg?: any,
+  filter<This = undefined>(
+    predicate: (this: This, value: T, index: number, array: this) => boolean,
+    thisArg?: This,
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
-      array: readonly T[],
-    ) => T,
-  ): T;
-  reduce(
-    callbackfn: (
-      previousValue: T,
-      currentValue: T,
-      currentIndex: number,
-      array: readonly T[],
-    ) => T,
-    initialValue: T,
-  ): T;
+      array: this,
+    ) => U,
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
-      array: readonly T[],
+      array: this,
     ) => U,
     initialValue: U,
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
-      array: readonly T[],
-    ) => T,
-  ): T;
-  reduceRight(
-    callbackfn: (
-      previousValue: T,
-      currentValue: T,
-      currentIndex: number,
-      array: readonly T[],
-    ) => T,
-    initialValue: T,
-  ): T;
+      array: this,
+    ) => U,
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
-      array: readonly T[],
+      array: this,
     ) => U,
     initialValue: U,
   ): U;
 
@@ -1551,23 +1651,25 @@
    * which is coercible to the Boolean value false, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  every<S extends T>(
-    predicate: (value: T, index: number, array: T[]) => value is S,
-    thisArg?: any,
-  ): this is S[];
+  every<S extends T, This = undefined>(
+    predicate: (this: This, value: T, index: number, array: this) => value is S,
+    thisArg?: This,
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
-    thisArg?: any,
+  every<This = undefined>(
+    predicate: (this: This, value: T, index: number, array: this) => boolean,
+    thisArg?: This,
   ): boolean;
   /**
    * Determines whether the specified callback function returns true for any element of an array.
    * @param predicate A function that accepts up to three arguments. The some method calls
@@ -1575,133 +1677,116 @@
    * which is coercible to the Boolean value true, or until the end of the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  some(
-    predicate: (value: T, index: number, array: T[]) => unknown,
-    thisArg?: any,
+  some<This = undefined>(
+    predicate: (this: This, value: T, index: number, array: this) => boolean,
+    thisArg?: This,
   ): boolean;
   /**
    * Performs the specified action for each element in an array.
    * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
    * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
    */
-  forEach(
-    callbackfn: (value: T, index: number, array: T[]) => void,
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: T, index: number, array: this) => void,
+    thisArg?: This,
   ): void;
   /**
    * Calls a defined callback function on each element of an array, and returns an array that contains the results.
    * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
    */
-  map<U>(
-    callbackfn: (value: T, index: number, array: T[]) => U,
-    thisArg?: any,
-  ): U[];
+  map<U, This = undefined>(
+    callbackfn: (this: This, value: T, index: number, array: this) => U,
+    thisArg?: This,
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
-    thisArg?: any,
+  filter<S extends T, This = undefined>(
+    predicate: (this: This, value: T, index: number, array: this) => value is S,
+    thisArg?: This,
   ): S[];
   /**
    * Returns the elements of an array that meet the condition specified in a callback function.
    * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
    */
-  filter(
-    predicate: (value: T, index: number, array: T[]) => unknown,
-    thisArg?: any,
+  filter<This = undefined>(
+    predicate: (this: This, value: T, index: number, array: this) => boolean,
+    thisArg?: This,
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
-      array: T[],
-    ) => T,
-  ): T;
-  reduce(
-    callbackfn: (
-      previousValue: T,
-      currentValue: T,
-      currentIndex: number,
-      array: T[],
-    ) => T,
-    initialValue: T,
-  ): T;
+      array: this,
+    ) => U,
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
-      array: T[],
+      array: this,
     ) => U,
     initialValue: U,
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
-      array: T[],
-    ) => T,
-  ): T;
-  reduceRight(
-    callbackfn: (
-      previousValue: T,
-      currentValue: T,
-      currentIndex: number,
-      array: T[],
-    ) => T,
-    initialValue: T,
-  ): T;
+      array: this,
+    ) => U,
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
-      array: T[],
+      array: this,
     ) => U,
     initialValue: U,
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
 
@@ -1715,9 +1800,11 @@
 }
 
 declare type PromiseConstructorLike = new <T>(
   executor: (
-    resolve: (value: T | PromiseLike<T>) => void,
+    resolve: undefined extends T
+      ? (value?: T | PromiseLike<T>) => void
+      : (value: T | PromiseLike<T>) => void,
     reject: (reason?: any) => void,
   ) => void,
 ) => PromiseLike<T>;
 
@@ -1727,52 +1814,56 @@
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
-      | null,
-  ): PromiseLike<TResult1 | TResult2>;
+  then(
+    onfulfilled?: null | undefined,
+    onrejected?: ((reason: unknown) => T | PromiseLike<T>) | null | undefined,
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
+    onrejected?: ((reason: unknown) => U | PromiseLike<U>) | null | undefined,
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
-      | null,
-  ): Promise<TResult1 | TResult2>;
+  then(
+    onfulfilled?: null | undefined,
+    onrejected?: ((reason: unknown) => T | PromiseLike<T>) | null | undefined,
+  ): Promise<T>;
 
   /**
+   * Attaches callbacks for the resolution and/or rejection of the Promise.
+   * @param onfulfilled The callback to execute when the Promise is resolved.
+   * @param onrejected The callback to execute when the Promise is rejected.
+   * @returns A Promise for the completion of which ever callback is executed.
+   */
+  then<U>(
+    onfulfilled: (value: T) => U | PromiseLike<U>,
+    onrejected?: ((reason: unknown) => U | PromiseLike<U>) | null | undefined,
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
-      | null,
-  ): Promise<T | TResult>;
+  catch(
+    onrejected?: ((reason: unknown) => T | PromiseLike<T>) | null | undefined,
+  ): Promise<T>;
 }
 
 /**
  * Recursively unwraps the "awaited type" of a type. Non-promise "thenables" should resolve to `never`. This emulates the behavior of `await`.
@@ -2131,20 +2222,24 @@
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
-    thisArg?: any,
+  every<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): boolean;
 
   /**
    * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
@@ -2154,21 +2249,24 @@
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
-    thisArg?: any,
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): Int8Array;
-
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -2176,13 +2274,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (value: number, index: number, obj: Int8Array) => boolean,
-    thisArg?: any,
+  find<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
   ): number | undefined;
-
   /**
    * Returns the index of the first element in the array where predicate is true, and -1
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -2190,23 +2287,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (value: number, index: number, obj: Int8Array) => boolean,
-    thisArg?: any,
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
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
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This,
   ): void;
 
   /**
    * Returns the index of the first occurrence of a value in an array.
@@ -2234,50 +2330,40 @@
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
-    thisArg?: any,
+  map<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => number,
+    thisArg?: This,
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
-      array: Int8Array,
-    ) => number,
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Int8Array,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+      array: this,
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -2286,46 +2372,32 @@
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
-      array: Int8Array,
+      array: this,
     ) => U,
     initialValue: U,
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
-      array: Int8Array,
-    ) => number,
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Int8Array,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+      array: this,
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -2334,14 +2406,14 @@
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
-      array: Int8Array,
+      array: this,
     ) => U,
     initialValue: U,
   ): U;
 
@@ -2362,20 +2434,24 @@
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
-    thisArg?: any,
+  some<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): boolean;
 
   /**
    * Sorts an array.
@@ -2430,25 +2506,23 @@
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
-    thisArg?: any,
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This,
   ): Int8Array;
 }
 declare var Int8Array: Int8ArrayConstructor;
 
@@ -2486,20 +2560,24 @@
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
-    thisArg?: any,
+  every<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): boolean;
 
   /**
    * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
@@ -2509,21 +2587,24 @@
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
-    thisArg?: any,
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): Uint8Array;
-
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -2531,13 +2612,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (value: number, index: number, obj: Uint8Array) => boolean,
-    thisArg?: any,
+  find<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
   ): number | undefined;
-
   /**
    * Returns the index of the first element in the array where predicate is true, and -1
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -2545,23 +2625,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (value: number, index: number, obj: Uint8Array) => boolean,
-    thisArg?: any,
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
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
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This,
   ): void;
 
   /**
    * Returns the index of the first occurrence of a value in an array.
@@ -2589,50 +2668,40 @@
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
-    thisArg?: any,
+  map<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => number,
+    thisArg?: This,
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
-      array: Uint8Array,
-    ) => number,
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Uint8Array,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+      array: this,
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -2641,46 +2710,32 @@
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
-      array: Uint8Array,
+      array: this,
     ) => U,
     initialValue: U,
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
-      array: Uint8Array,
-    ) => number,
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Uint8Array,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+      array: this,
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -2689,14 +2744,14 @@
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
-      array: Uint8Array,
+      array: this,
     ) => U,
     initialValue: U,
   ): U;
 
@@ -2717,20 +2772,24 @@
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
-    thisArg?: any,
+  some<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): boolean;
 
   /**
    * Sorts an array.
@@ -2786,25 +2845,23 @@
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
-    thisArg?: any,
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This,
   ): Uint8Array;
 }
 declare var Uint8Array: Uint8ArrayConstructor;
 
@@ -2842,24 +2899,24 @@
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
-      array: Uint8ClampedArray,
-    ) => unknown,
-    thisArg?: any,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): boolean;
 
   /**
    * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
@@ -2869,21 +2926,24 @@
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
-    thisArg?: any,
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): Uint8ClampedArray;
-
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -2891,17 +2951,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (
-      value: number,
-      index: number,
-      obj: Uint8ClampedArray,
-    ) => boolean,
-    thisArg?: any,
+  find<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
   ): number | undefined;
-
   /**
    * Returns the index of the first element in the array where predicate is true, and -1
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -2909,31 +2964,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (
-      value: number,
-      index: number,
-      obj: Uint8ClampedArray,
-    ) => boolean,
-    thisArg?: any,
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
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
-      array: Uint8ClampedArray,
-    ) => void,
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This,
   ): void;
 
   /**
    * Returns the index of the first occurrence of a value in an array.
@@ -2961,54 +3007,40 @@
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
-      array: Uint8ClampedArray,
+      array: this,
     ) => number,
-    thisArg?: any,
+    thisArg?: This,
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
-      array: Uint8ClampedArray,
-    ) => number,
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Uint8ClampedArray,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+      array: this,
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -3017,46 +3049,32 @@
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
-      array: Uint8ClampedArray,
+      array: this,
     ) => U,
     initialValue: U,
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
-      array: Uint8ClampedArray,
-    ) => number,
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Uint8ClampedArray,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+      array: this,
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -3065,14 +3083,14 @@
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
-      array: Uint8ClampedArray,
+      array: this,
     ) => U,
     initialValue: U,
   ): U;
 
@@ -3093,24 +3111,24 @@
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
-      array: Uint8ClampedArray,
-    ) => unknown,
-    thisArg?: any,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): boolean;
 
   /**
    * Sorts an array.
@@ -3166,25 +3184,23 @@
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
-    thisArg?: any,
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This,
   ): Uint8ClampedArray;
 }
 declare var Uint8ClampedArray: Uint8ClampedArrayConstructor;
 
@@ -3222,20 +3238,24 @@
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
-    thisArg?: any,
+  every<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): boolean;
 
   /**
    * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
@@ -3245,21 +3265,24 @@
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
-    thisArg?: any,
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): Int16Array;
-
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -3267,13 +3290,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (value: number, index: number, obj: Int16Array) => boolean,
-    thisArg?: any,
+  find<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
   ): number | undefined;
-
   /**
    * Returns the index of the first element in the array where predicate is true, and -1
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -3281,23 +3303,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (value: number, index: number, obj: Int16Array) => boolean,
-    thisArg?: any,
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
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
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This,
   ): void;
   /**
    * Returns the index of the first occurrence of a value in an array.
    * @param searchElement The value to locate in the array.
@@ -3324,50 +3345,40 @@
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
-    thisArg?: any,
+  map<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => number,
+    thisArg?: This,
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
-      array: Int16Array,
-    ) => number,
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Int16Array,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+      array: this,
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -3376,46 +3387,32 @@
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
-      array: Int16Array,
+      array: this,
     ) => U,
     initialValue: U,
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
-      array: Int16Array,
-    ) => number,
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Int16Array,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+      array: this,
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -3424,14 +3421,14 @@
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
-      array: Int16Array,
+      array: this,
     ) => U,
     initialValue: U,
   ): U;
 
@@ -3452,20 +3449,24 @@
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
-    thisArg?: any,
+  some<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): boolean;
 
   /**
    * Sorts an array.
@@ -3521,25 +3522,23 @@
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
-    thisArg?: any,
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This,
   ): Int16Array;
 }
 declare var Int16Array: Int16ArrayConstructor;
 
@@ -3577,20 +3576,24 @@
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
-    thisArg?: any,
+  every<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): boolean;
 
   /**
    * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
@@ -3600,21 +3603,24 @@
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
-    thisArg?: any,
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): Uint16Array;
-
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -3622,13 +3628,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (value: number, index: number, obj: Uint16Array) => boolean,
-    thisArg?: any,
+  find<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
   ): number | undefined;
-
   /**
    * Returns the index of the first element in the array where predicate is true, and -1
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -3636,23 +3641,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (value: number, index: number, obj: Uint16Array) => boolean,
-    thisArg?: any,
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
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
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This,
   ): void;
 
   /**
    * Returns the index of the first occurrence of a value in an array.
@@ -3680,50 +3684,40 @@
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
-    thisArg?: any,
+  map<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => number,
+    thisArg?: This,
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
-      array: Uint16Array,
-    ) => number,
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Uint16Array,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+      array: this,
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -3732,46 +3726,32 @@
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
-      array: Uint16Array,
+      array: this,
     ) => U,
     initialValue: U,
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
-      array: Uint16Array,
-    ) => number,
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Uint16Array,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+      array: this,
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -3780,14 +3760,14 @@
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
-      array: Uint16Array,
+      array: this,
     ) => U,
     initialValue: U,
   ): U;
 
@@ -3808,20 +3788,24 @@
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
-    thisArg?: any,
+  some<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): boolean;
 
   /**
    * Sorts an array.
@@ -3877,25 +3861,23 @@
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
-    thisArg?: any,
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This,
   ): Uint16Array;
 }
 declare var Uint16Array: Uint16ArrayConstructor;
 /**
@@ -3932,20 +3914,24 @@
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
-    thisArg?: any,
+  every<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): boolean;
 
   /**
    * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
@@ -3955,21 +3941,24 @@
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
-    thisArg?: any,
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): Int32Array;
-
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -3977,13 +3966,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (value: number, index: number, obj: Int32Array) => boolean,
-    thisArg?: any,
+  find<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
   ): number | undefined;
-
   /**
    * Returns the index of the first element in the array where predicate is true, and -1
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -3991,23 +3979,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (value: number, index: number, obj: Int32Array) => boolean,
-    thisArg?: any,
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
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
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This,
   ): void;
 
   /**
    * Returns the index of the first occurrence of a value in an array.
@@ -4035,50 +4022,40 @@
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
-    thisArg?: any,
+  map<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => number,
+    thisArg?: This,
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
-      array: Int32Array,
-    ) => number,
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Int32Array,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+      array: this,
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -4087,46 +4064,32 @@
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
-      array: Int32Array,
+      array: this,
     ) => U,
     initialValue: U,
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
-      array: Int32Array,
-    ) => number,
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Int32Array,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+      array: this,
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -4135,14 +4098,14 @@
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
-      array: Int32Array,
+      array: this,
     ) => U,
     initialValue: U,
   ): U;
 
@@ -4163,20 +4126,24 @@
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
-    thisArg?: any,
+  some<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): boolean;
 
   /**
    * Sorts an array.
@@ -4232,25 +4199,23 @@
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
-    thisArg?: any,
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This,
   ): Int32Array;
 }
 declare var Int32Array: Int32ArrayConstructor;
 
@@ -4288,20 +4253,24 @@
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
-    thisArg?: any,
+  every<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): boolean;
 
   /**
    * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
@@ -4311,21 +4280,24 @@
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
-    thisArg?: any,
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): Uint32Array;
-
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -4333,13 +4305,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (value: number, index: number, obj: Uint32Array) => boolean,
-    thisArg?: any,
+  find<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
   ): number | undefined;
-
   /**
    * Returns the index of the first element in the array where predicate is true, and -1
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -4347,23 +4318,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (value: number, index: number, obj: Uint32Array) => boolean,
-    thisArg?: any,
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
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
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This,
   ): void;
   /**
    * Returns the index of the first occurrence of a value in an array.
    * @param searchElement The value to locate in the array.
@@ -4390,50 +4360,40 @@
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
-    thisArg?: any,
+  map<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => number,
+    thisArg?: This,
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
-      array: Uint32Array,
-    ) => number,
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Uint32Array,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+      array: this,
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -4442,46 +4402,32 @@
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
-      array: Uint32Array,
+      array: this,
     ) => U,
     initialValue: U,
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
-      array: Uint32Array,
-    ) => number,
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Uint32Array,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+      array: this,
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -4490,14 +4436,14 @@
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
-      array: Uint32Array,
+      array: this,
     ) => U,
     initialValue: U,
   ): U;
 
@@ -4518,20 +4464,24 @@
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
-    thisArg?: any,
+  some<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): boolean;
 
   /**
    * Sorts an array.
@@ -4587,25 +4537,23 @@
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
-    thisArg?: any,
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This,
   ): Uint32Array;
 }
 declare var Uint32Array: Uint32ArrayConstructor;
 
@@ -4643,20 +4591,24 @@
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
-    thisArg?: any,
+  every<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): boolean;
 
   /**
    * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
@@ -4666,21 +4618,24 @@
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
-    thisArg?: any,
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): Float32Array;
-
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -4688,13 +4643,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (value: number, index: number, obj: Float32Array) => boolean,
-    thisArg?: any,
+  find<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
   ): number | undefined;
-
   /**
    * Returns the index of the first element in the array where predicate is true, and -1
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -4702,23 +4656,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (value: number, index: number, obj: Float32Array) => boolean,
-    thisArg?: any,
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
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
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This,
   ): void;
 
   /**
    * Returns the index of the first occurrence of a value in an array.
@@ -4746,50 +4699,40 @@
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
-    thisArg?: any,
+  map<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => number,
+    thisArg?: This,
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
-      array: Float32Array,
-    ) => number,
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Float32Array,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+      array: this,
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -4798,46 +4741,32 @@
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
-      array: Float32Array,
+      array: this,
     ) => U,
     initialValue: U,
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
-      array: Float32Array,
-    ) => number,
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Float32Array,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+      array: this,
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -4846,14 +4775,14 @@
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
-      array: Float32Array,
+      array: this,
     ) => U,
     initialValue: U,
   ): U;
 
@@ -4874,20 +4803,24 @@
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
-    thisArg?: any,
+  some<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): boolean;
 
   /**
    * Sorts an array.
@@ -4943,25 +4876,23 @@
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
-    thisArg?: any,
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This,
   ): Float32Array;
 }
 declare var Float32Array: Float32ArrayConstructor;
 
@@ -4999,20 +4930,24 @@
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
-    thisArg?: any,
+  every<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): boolean;
 
   /**
    * Changes all array elements from `start` to `end` index to a static `value` and returns the modified array
@@ -5022,21 +4957,24 @@
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
-    thisArg?: any,
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): Float64Array;
-
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -5044,13 +4982,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (value: number, index: number, obj: Float64Array) => boolean,
-    thisArg?: any,
+  find<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
   ): number | undefined;
-
   /**
    * Returns the index of the first element in the array where predicate is true, and -1
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -5058,23 +4995,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (value: number, index: number, obj: Float64Array) => boolean,
-    thisArg?: any,
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
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
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This,
   ): void;
 
   /**
    * Returns the index of the first occurrence of a value in an array.
@@ -5102,50 +5038,40 @@
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
-    thisArg?: any,
+  map<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => number,
+    thisArg?: This,
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
-      array: Float64Array,
-    ) => number,
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Float64Array,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+      array: this,
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -5154,46 +5080,32 @@
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
-      array: Float64Array,
+      array: this,
     ) => U,
     initialValue: U,
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
-      array: Float64Array,
-    ) => number,
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: Float64Array,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+      array: this,
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -5202,14 +5114,14 @@
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
-      array: Float64Array,
+      array: this,
     ) => U,
     initialValue: U,
   ): U;
 
@@ -5230,20 +5142,24 @@
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
-    thisArg?: any,
+  some<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
   ): boolean;
 
   /**
    * Sorts an array.
@@ -5299,25 +5215,23 @@
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
-    thisArg?: any,
+    mapfn: (this: This, v: T, k: number) => number,
+    thisArg?: This,
   ): Float64Array;
 }
 declare var Float64Array: Float64ArrayConstructor;
 
@@ -5536,4 +5450,33 @@
     locales?: string | string[],
     options?: Intl.DateTimeFormatOptions,
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
