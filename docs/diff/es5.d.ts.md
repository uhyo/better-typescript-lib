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
@@ -1200,37 +1285,71 @@
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
+    replacer:
+      | ((
+          this: JSONComposite<A>,
+          key: string,
+          value: ToJSON<A>,
+        ) => JSONValueF<A>)
+      | null
+      | undefined,
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
+    replacer:
+      | ((
+          this: JSONComposite<A>,
+          key: string,
+          value: ToJSON<A>,
+        ) => JSONValueF<A> | undefined)
+      | null
+      | undefined,
+    space?: string | number | null | undefined,
+  ): string | undefined;
 }
 
 /**
  * An intrinsic object that provides functions to convert JavaScript values to and from the JavaScript Object Notation (JSON) format.
@@ -1294,23 +1413,25 @@
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
@@ -1318,117 +1439,102 @@
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
-   * @param callbackfn A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
-   * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
+   * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
+   * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
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
 
@@ -1552,23 +1658,25 @@
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
@@ -1576,133 +1684,116 @@
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
-   * @param callbackfn A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
-   * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
+   * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
+   * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
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
 
@@ -1716,9 +1807,11 @@
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
 
@@ -1728,52 +1821,56 @@
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
+  then<U>(
+    onfulfilled: (value: T) => U | PromiseLike<U>,
+    onrejected?: ((reason: unknown) => U | PromiseLike<U>) | null | undefined,
+  ): PromiseLike<U>;
+
+  /**
+   * Attaches callbacks for the resolution and/or rejection of the Promise.
+   * @param onfulfilled The callback to execute when the Promise is resolved.
+   * @param onrejected The callback to execute when the Promise is rejected.
+   * @returns A Promise for the completion of which ever callback is executed.
+   */
+  then<U>(
+    onfulfilled: ((value: T) => U | PromiseLike<U>) | null | undefined,
+    onrejected?: ((reason: unknown) => U | PromiseLike<U>) | null | undefined,
+  ): PromiseLike<T | U>;
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
+  then<U>(
+    onfulfilled: (value: T) => U | PromiseLike<U>,
+    onrejected?: ((reason: unknown) => U | PromiseLike<U>) | null | undefined,
+  ): Promise<U>;
 
   /**
+   * Attaches callbacks for the resolution and/or rejection of the Promise.
+   * @param onfulfilled The callback to execute when the Promise is resolved.
+   * @param onrejected The callback to execute when the Promise is rejected.
+   * @returns A Promise for the completion of which ever callback is executed.
+   */
+  then<U>(
+    onfulfilled: ((value: T) => U | PromiseLike<U>) | null | undefined,
+    onrejected?: ((reason: unknown) => U | PromiseLike<U>) | null | undefined,
+  ): Promise<T | U>;
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
+  catch<U>(
+    onrejected: ((reason: unknown) => U | PromiseLike<U>) | null | undefined,
+  ): Promise<T | U>;
 }
 
 /**
  * Recursively unwraps the "awaited type" of a type. Non-promise "thenables" should resolve to `never`. This emulates the behavior of `await`.
@@ -1837,8 +1934,11 @@
 type Extract<T, U> = T extends U ? T : never;
 
 /**
  * Construct a type with the properties of T except for those in type K.
+ *
+ * @deprecated Omit is known to have an undesired behavior. It is recommended to bring your own implementation or use a library.
+ * @see {@link https://github.com/microsoft/TypeScript/issues/54451}
  */
 type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
 
 /**
@@ -2138,20 +2238,24 @@
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
-    predicate: (value: number, index: number, array: this) => unknown,
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
@@ -2161,21 +2265,24 @@
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
-    predicate: (value: number, index: number, array: this) => any,
-    thisArg?: any,
-  ): Int8Array<ArrayBuffer>;
-
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
+  ): Int8Array;
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -2183,13 +2290,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (value: number, index: number, obj: this) => boolean,
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
@@ -2197,23 +2303,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (value: number, index: number, obj: this) => boolean,
-    thisArg?: any,
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
   ): number;
-
   /**
    * Performs the specified action for each element in an array.
-   * @param callbackfn A function that accepts up to three arguments. forEach calls the
+   * @param callbackfn  A function that accepts up to three arguments. forEach calls the
    * callbackfn function one time for each element in the array.
-   * @param thisArg An object to which the this keyword can refer in the callbackfn function.
+   * @param thisArg  An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  forEach(
-    callbackfn: (value: number, index: number, array: this) => void,
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This,
   ): void;
 
   /**
    * Returns the index of the first occurrence of a value in an array.
@@ -2241,50 +2346,40 @@
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
-    callbackfn: (value: number, index: number, array: this) => number,
-    thisArg?: any,
-  ): Int8Array<ArrayBuffer>;
-
+  map<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => number,
+    thisArg?: This,
+  ): Int8Array;
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
       array: this,
-    ) => number,
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: this,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -2293,46 +2388,32 @@
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
       array: this,
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
       array: this,
-    ) => number,
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: this,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -2341,9 +2422,9 @@
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
@@ -2369,20 +2450,24 @@
    * @param start The beginning of the specified portion of the array.
    * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
    */
   slice(start?: number, end?: number): Int8Array<ArrayBuffer>;
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
-    predicate: (value: number, index: number, array: this) => unknown,
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
@@ -2443,25 +2528,23 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Int8Array<ArrayBuffer>;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like object to convert to an array.
+   * @param arrayLike An array-like or iterable object to convert to an array.
    */
   from(arrayLike: ArrayLike<number>): Int8Array<ArrayBuffer>;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like object to convert to an array.
+   * @param arrayLike An array-like or iterable object to convert to an array.
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
   ): Int8Array<ArrayBuffer>;
 }
 declare var Int8Array: Int8ArrayConstructor;
 
@@ -2499,20 +2582,24 @@
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
-    predicate: (value: number, index: number, array: this) => unknown,
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
@@ -2522,21 +2609,24 @@
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
-    predicate: (value: number, index: number, array: this) => any,
-    thisArg?: any,
-  ): Uint8Array<ArrayBuffer>;
-
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
+  ): Uint8Array;
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -2544,13 +2634,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (value: number, index: number, obj: this) => boolean,
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
@@ -2558,23 +2647,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (value: number, index: number, obj: this) => boolean,
-    thisArg?: any,
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
   ): number;
-
   /**
    * Performs the specified action for each element in an array.
-   * @param callbackfn A function that accepts up to three arguments. forEach calls the
+   * @param callbackfn  A function that accepts up to three arguments. forEach calls the
    * callbackfn function one time for each element in the array.
-   * @param thisArg An object to which the this keyword can refer in the callbackfn function.
+   * @param thisArg  An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  forEach(
-    callbackfn: (value: number, index: number, array: this) => void,
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This,
   ): void;
 
   /**
    * Returns the index of the first occurrence of a value in an array.
@@ -2602,50 +2690,40 @@
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
-    callbackfn: (value: number, index: number, array: this) => number,
-    thisArg?: any,
-  ): Uint8Array<ArrayBuffer>;
-
+  map<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => number,
+    thisArg?: This,
+  ): Uint8Array;
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
       array: this,
-    ) => number,
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: this,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -2654,46 +2732,32 @@
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
       array: this,
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
       array: this,
-    ) => number,
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: this,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -2702,9 +2766,9 @@
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
@@ -2730,20 +2794,24 @@
    * @param start The beginning of the specified portion of the array.
    * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
    */
   slice(start?: number, end?: number): Uint8Array<ArrayBuffer>;
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
-    predicate: (value: number, index: number, array: this) => unknown,
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
@@ -2804,25 +2872,23 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Uint8Array<ArrayBuffer>;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like object to convert to an array.
+   * @param arrayLike An array-like or iterable object to convert to an array.
    */
   from(arrayLike: ArrayLike<number>): Uint8Array<ArrayBuffer>;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like object to convert to an array.
+   * @param arrayLike An array-like or iterable object to convert to an array.
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
   ): Uint8Array<ArrayBuffer>;
 }
 declare var Uint8Array: Uint8ArrayConstructor;
 
@@ -2862,20 +2928,24 @@
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
-    predicate: (value: number, index: number, array: this) => unknown,
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
@@ -2885,21 +2955,24 @@
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
-    predicate: (value: number, index: number, array: this) => any,
-    thisArg?: any,
-  ): Uint8ClampedArray<ArrayBuffer>;
-
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
+  ): Uint8ClampedArray;
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -2907,13 +2980,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (value: number, index: number, obj: this) => boolean,
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
@@ -2921,23 +2993,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (value: number, index: number, obj: this) => boolean,
-    thisArg?: any,
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
   ): number;
-
   /**
    * Performs the specified action for each element in an array.
-   * @param callbackfn A function that accepts up to three arguments. forEach calls the
+   * @param callbackfn  A function that accepts up to three arguments. forEach calls the
    * callbackfn function one time for each element in the array.
-   * @param thisArg An object to which the this keyword can refer in the callbackfn function.
+   * @param thisArg  An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  forEach(
-    callbackfn: (value: number, index: number, array: this) => void,
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This,
   ): void;
 
   /**
    * Returns the index of the first occurrence of a value in an array.
@@ -2965,50 +3036,40 @@
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
-    callbackfn: (value: number, index: number, array: this) => number,
-    thisArg?: any,
-  ): Uint8ClampedArray<ArrayBuffer>;
-
+  map<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => number,
+    thisArg?: This,
+  ): Uint8ClampedArray;
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
       array: this,
-    ) => number,
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: this,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -3017,46 +3078,32 @@
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
       array: this,
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
       array: this,
-    ) => number,
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: this,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -3065,9 +3112,9 @@
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
@@ -3093,20 +3140,24 @@
    * @param start The beginning of the specified portion of the array.
    * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
    */
   slice(start?: number, end?: number): Uint8ClampedArray<ArrayBuffer>;
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
-    predicate: (value: number, index: number, array: this) => unknown,
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
@@ -3167,25 +3218,23 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Uint8ClampedArray<ArrayBuffer>;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like object to convert to an array.
+   * @param arrayLike An array-like or iterable object to convert to an array.
    */
   from(arrayLike: ArrayLike<number>): Uint8ClampedArray<ArrayBuffer>;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like object to convert to an array.
+   * @param arrayLike An array-like or iterable object to convert to an array.
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
   ): Uint8ClampedArray<ArrayBuffer>;
 }
 declare var Uint8ClampedArray: Uint8ClampedArrayConstructor;
 
@@ -3223,20 +3272,24 @@
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
-    predicate: (value: number, index: number, array: this) => unknown,
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
@@ -3246,21 +3299,24 @@
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
-    predicate: (value: number, index: number, array: this) => any,
-    thisArg?: any,
-  ): Int16Array<ArrayBuffer>;
-
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
+  ): Int16Array;
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -3268,13 +3324,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (value: number, index: number, obj: this) => boolean,
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
@@ -3282,23 +3337,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (value: number, index: number, obj: this) => boolean,
-    thisArg?: any,
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
   ): number;
-
   /**
    * Performs the specified action for each element in an array.
-   * @param callbackfn A function that accepts up to three arguments. forEach calls the
+   * @param callbackfn  A function that accepts up to three arguments. forEach calls the
    * callbackfn function one time for each element in the array.
-   * @param thisArg An object to which the this keyword can refer in the callbackfn function.
+   * @param thisArg  An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  forEach(
-    callbackfn: (value: number, index: number, array: this) => void,
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This,
   ): void;
   /**
    * Returns the index of the first occurrence of a value in an array.
    * @param searchElement The value to locate in the array.
@@ -3325,50 +3379,40 @@
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
-    callbackfn: (value: number, index: number, array: this) => number,
-    thisArg?: any,
-  ): Int16Array<ArrayBuffer>;
-
+  map<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => number,
+    thisArg?: This,
+  ): Int16Array;
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
       array: this,
-    ) => number,
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: this,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -3377,46 +3421,32 @@
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
       array: this,
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
       array: this,
-    ) => number,
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: this,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -3425,9 +3455,9 @@
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
@@ -3453,20 +3483,24 @@
    * @param start The beginning of the specified portion of the array.
    * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
    */
   slice(start?: number, end?: number): Int16Array<ArrayBuffer>;
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
-    predicate: (value: number, index: number, array: this) => unknown,
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
@@ -3527,25 +3561,23 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Int16Array<ArrayBuffer>;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like object to convert to an array.
+   * @param arrayLike An array-like or iterable object to convert to an array.
    */
   from(arrayLike: ArrayLike<number>): Int16Array<ArrayBuffer>;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like object to convert to an array.
+   * @param arrayLike An array-like or iterable object to convert to an array.
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
   ): Int16Array<ArrayBuffer>;
 }
 declare var Int16Array: Int16ArrayConstructor;
 
@@ -3583,20 +3615,24 @@
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
-    predicate: (value: number, index: number, array: this) => unknown,
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
@@ -3606,21 +3642,24 @@
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
-    predicate: (value: number, index: number, array: this) => any,
-    thisArg?: any,
-  ): Uint16Array<ArrayBuffer>;
-
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
+  ): Uint16Array;
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -3628,13 +3667,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (value: number, index: number, obj: this) => boolean,
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
@@ -3642,23 +3680,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (value: number, index: number, obj: this) => boolean,
-    thisArg?: any,
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
   ): number;
-
   /**
    * Performs the specified action for each element in an array.
-   * @param callbackfn A function that accepts up to three arguments. forEach calls the
+   * @param callbackfn  A function that accepts up to three arguments. forEach calls the
    * callbackfn function one time for each element in the array.
-   * @param thisArg An object to which the this keyword can refer in the callbackfn function.
+   * @param thisArg  An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  forEach(
-    callbackfn: (value: number, index: number, array: this) => void,
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This,
   ): void;
 
   /**
    * Returns the index of the first occurrence of a value in an array.
@@ -3686,50 +3723,40 @@
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
-    callbackfn: (value: number, index: number, array: this) => number,
-    thisArg?: any,
-  ): Uint16Array<ArrayBuffer>;
-
+  map<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => number,
+    thisArg?: This,
+  ): Uint16Array;
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
       array: this,
-    ) => number,
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: this,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -3738,46 +3765,32 @@
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
       array: this,
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
       array: this,
-    ) => number,
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: this,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -3786,9 +3799,9 @@
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
@@ -3814,20 +3827,24 @@
    * @param start The beginning of the specified portion of the array.
    * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
    */
   slice(start?: number, end?: number): Uint16Array<ArrayBuffer>;
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
-    predicate: (value: number, index: number, array: this) => unknown,
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
@@ -3888,25 +3905,23 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Uint16Array<ArrayBuffer>;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like object to convert to an array.
+   * @param arrayLike An array-like or iterable object to convert to an array.
    */
   from(arrayLike: ArrayLike<number>): Uint16Array<ArrayBuffer>;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like object to convert to an array.
+   * @param arrayLike An array-like or iterable object to convert to an array.
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
   ): Uint16Array<ArrayBuffer>;
 }
 declare var Uint16Array: Uint16ArrayConstructor;
 /**
@@ -3943,20 +3958,24 @@
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
-    predicate: (value: number, index: number, array: this) => unknown,
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
@@ -3966,21 +3985,24 @@
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
-    predicate: (value: number, index: number, array: this) => any,
-    thisArg?: any,
-  ): Int32Array<ArrayBuffer>;
-
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
+  ): Int32Array;
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -3988,13 +4010,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (value: number, index: number, obj: this) => boolean,
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
@@ -4002,23 +4023,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (value: number, index: number, obj: this) => boolean,
-    thisArg?: any,
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
   ): number;
-
   /**
    * Performs the specified action for each element in an array.
-   * @param callbackfn A function that accepts up to three arguments. forEach calls the
+   * @param callbackfn  A function that accepts up to three arguments. forEach calls the
    * callbackfn function one time for each element in the array.
-   * @param thisArg An object to which the this keyword can refer in the callbackfn function.
+   * @param thisArg  An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  forEach(
-    callbackfn: (value: number, index: number, array: this) => void,
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This,
   ): void;
 
   /**
    * Returns the index of the first occurrence of a value in an array.
@@ -4046,50 +4066,40 @@
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
-    callbackfn: (value: number, index: number, array: this) => number,
-    thisArg?: any,
-  ): Int32Array<ArrayBuffer>;
-
+  map<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => number,
+    thisArg?: This,
+  ): Int32Array;
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
       array: this,
-    ) => number,
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: this,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -4098,46 +4108,32 @@
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
       array: this,
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
       array: this,
-    ) => number,
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: this,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -4146,9 +4142,9 @@
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
@@ -4174,20 +4170,24 @@
    * @param start The beginning of the specified portion of the array.
    * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
    */
   slice(start?: number, end?: number): Int32Array<ArrayBuffer>;
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
-    predicate: (value: number, index: number, array: this) => unknown,
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
@@ -4248,25 +4248,23 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Int32Array<ArrayBuffer>;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like object to convert to an array.
+   * @param arrayLike An array-like or iterable object to convert to an array.
    */
   from(arrayLike: ArrayLike<number>): Int32Array<ArrayBuffer>;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like object to convert to an array.
+   * @param arrayLike An array-like or iterable object to convert to an array.
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
   ): Int32Array<ArrayBuffer>;
 }
 declare var Int32Array: Int32ArrayConstructor;
 
@@ -4304,20 +4302,24 @@
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
-    predicate: (value: number, index: number, array: this) => unknown,
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
@@ -4327,21 +4329,24 @@
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
-    predicate: (value: number, index: number, array: this) => any,
-    thisArg?: any,
-  ): Uint32Array<ArrayBuffer>;
-
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
+  ): Uint32Array;
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -4349,13 +4354,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (value: number, index: number, obj: this) => boolean,
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
@@ -4363,23 +4367,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (value: number, index: number, obj: this) => boolean,
-    thisArg?: any,
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
   ): number;
-
   /**
    * Performs the specified action for each element in an array.
-   * @param callbackfn A function that accepts up to three arguments. forEach calls the
+   * @param callbackfn  A function that accepts up to three arguments. forEach calls the
    * callbackfn function one time for each element in the array.
-   * @param thisArg An object to which the this keyword can refer in the callbackfn function.
+   * @param thisArg  An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  forEach(
-    callbackfn: (value: number, index: number, array: this) => void,
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This,
   ): void;
   /**
    * Returns the index of the first occurrence of a value in an array.
    * @param searchElement The value to locate in the array.
@@ -4406,50 +4409,40 @@
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
-    callbackfn: (value: number, index: number, array: this) => number,
-    thisArg?: any,
-  ): Uint32Array<ArrayBuffer>;
-
+  map<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => number,
+    thisArg?: This,
+  ): Uint32Array;
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
       array: this,
-    ) => number,
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: this,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -4458,46 +4451,32 @@
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
       array: this,
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
       array: this,
-    ) => number,
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: this,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -4506,9 +4485,9 @@
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
@@ -4534,20 +4513,24 @@
    * @param start The beginning of the specified portion of the array.
    * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
    */
   slice(start?: number, end?: number): Uint32Array<ArrayBuffer>;
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
-    predicate: (value: number, index: number, array: this) => unknown,
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
@@ -4608,25 +4591,23 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Uint32Array<ArrayBuffer>;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like object to convert to an array.
+   * @param arrayLike An array-like or iterable object to convert to an array.
    */
   from(arrayLike: ArrayLike<number>): Uint32Array<ArrayBuffer>;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like object to convert to an array.
+   * @param arrayLike An array-like or iterable object to convert to an array.
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
   ): Uint32Array<ArrayBuffer>;
 }
 declare var Uint32Array: Uint32ArrayConstructor;
 
@@ -4664,20 +4645,24 @@
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
-    predicate: (value: number, index: number, array: this) => unknown,
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
@@ -4687,21 +4672,24 @@
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
-    predicate: (value: number, index: number, array: this) => any,
-    thisArg?: any,
-  ): Float32Array<ArrayBuffer>;
-
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
+  ): Float32Array;
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -4709,13 +4697,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (value: number, index: number, obj: this) => boolean,
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
@@ -4723,23 +4710,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (value: number, index: number, obj: this) => boolean,
-    thisArg?: any,
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
   ): number;
-
   /**
    * Performs the specified action for each element in an array.
-   * @param callbackfn A function that accepts up to three arguments. forEach calls the
+   * @param callbackfn  A function that accepts up to three arguments. forEach calls the
    * callbackfn function one time for each element in the array.
-   * @param thisArg An object to which the this keyword can refer in the callbackfn function.
+   * @param thisArg  An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  forEach(
-    callbackfn: (value: number, index: number, array: this) => void,
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This,
   ): void;
 
   /**
    * Returns the index of the first occurrence of a value in an array.
@@ -4767,50 +4753,40 @@
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
-    callbackfn: (value: number, index: number, array: this) => number,
-    thisArg?: any,
-  ): Float32Array<ArrayBuffer>;
-
+  map<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => number,
+    thisArg?: This,
+  ): Float32Array;
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
       array: this,
-    ) => number,
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: this,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -4819,46 +4795,32 @@
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
       array: this,
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
       array: this,
-    ) => number,
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: this,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -4867,9 +4829,9 @@
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
@@ -4895,20 +4857,24 @@
    * @param start The beginning of the specified portion of the array.
    * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
    */
   slice(start?: number, end?: number): Float32Array<ArrayBuffer>;
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
-    predicate: (value: number, index: number, array: this) => unknown,
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
@@ -4969,25 +4935,23 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Float32Array<ArrayBuffer>;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like object to convert to an array.
+   * @param arrayLike An array-like or iterable object to convert to an array.
    */
   from(arrayLike: ArrayLike<number>): Float32Array<ArrayBuffer>;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like object to convert to an array.
+   * @param arrayLike An array-like or iterable object to convert to an array.
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
   ): Float32Array<ArrayBuffer>;
 }
 declare var Float32Array: Float32ArrayConstructor;
 
@@ -5025,20 +4989,24 @@
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
-    predicate: (value: number, index: number, array: this) => unknown,
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
@@ -5048,21 +5016,24 @@
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
-    predicate: (value: number, index: number, array: this) => any,
-    thisArg?: any,
-  ): Float64Array<ArrayBuffer>;
-
+  filter<This = undefined>(
+    predicate: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => boolean,
+    thisArg?: This,
+  ): Float64Array;
   /**
    * Returns the value of the first element in the array where predicate is true, and undefined
    * otherwise.
    * @param predicate find calls predicate once for each element of the array, in ascending
@@ -5070,13 +5041,12 @@
    * immediately returns that element value. Otherwise, find returns undefined.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  find(
-    predicate: (value: number, index: number, obj: this) => boolean,
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
@@ -5084,23 +5054,22 @@
    * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
    * @param thisArg If provided, it will be used as the this value for each invocation of
    * predicate. If it is not provided, undefined is used instead.
    */
-  findIndex(
-    predicate: (value: number, index: number, obj: this) => boolean,
-    thisArg?: any,
+  findIndex<This = undefined>(
+    predicate: (this: This, value: number, index: number, obj: this) => boolean,
+    thisArg?: This,
   ): number;
-
   /**
    * Performs the specified action for each element in an array.
-   * @param callbackfn A function that accepts up to three arguments. forEach calls the
+   * @param callbackfn  A function that accepts up to three arguments. forEach calls the
    * callbackfn function one time for each element in the array.
-   * @param thisArg An object to which the this keyword can refer in the callbackfn function.
+   * @param thisArg  An object to which the this keyword can refer in the callbackfn function.
    * If thisArg is omitted, undefined is used as the this value.
    */
-  forEach(
-    callbackfn: (value: number, index: number, array: this) => void,
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, index: number, array: this) => void,
+    thisArg?: This,
   ): void;
 
   /**
    * Returns the index of the first occurrence of a value in an array.
@@ -5128,50 +5097,40 @@
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
-    callbackfn: (value: number, index: number, array: this) => number,
-    thisArg?: any,
-  ): Float64Array<ArrayBuffer>;
-
+  map<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: number,
+      index: number,
+      array: this,
+    ) => number,
+    thisArg?: This,
+  ): Float64Array;
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
       array: this,
-    ) => number,
-  ): number;
-  reduce(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: this,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array. The return value of
    * the callback function is the accumulated result, and is provided as an argument in the next
    * call to the callback function.
@@ -5180,46 +5139,32 @@
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
       array: this,
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
       array: this,
-    ) => number,
-  ): number;
-  reduceRight(
-    callbackfn: (
-      previousValue: number,
-      currentValue: number,
-      currentIndex: number,
-      array: this,
-    ) => number,
-    initialValue: number,
-  ): number;
-
+    ) => U,
+  ): number | U;
   /**
    * Calls the specified callback function for all the elements in an array, in descending order.
    * The return value of the callback function is the accumulated result, and is provided as an
    * argument in the next call to the callback function.
@@ -5228,9 +5173,9 @@
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
@@ -5256,20 +5201,24 @@
    * @param start The beginning of the specified portion of the array.
    * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
    */
   slice(start?: number, end?: number): Float64Array<ArrayBuffer>;
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
-    predicate: (value: number, index: number, array: this) => unknown,
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
@@ -5330,25 +5279,23 @@
    * Returns a new array from a set of elements.
    * @param items A set of elements to include in the new array object.
    */
   of(...items: number[]): Float64Array<ArrayBuffer>;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like object to convert to an array.
+   * @param arrayLike An array-like or iterable object to convert to an array.
    */
   from(arrayLike: ArrayLike<number>): Float64Array<ArrayBuffer>;
-
   /**
    * Creates an array from an array-like or iterable object.
-   * @param arrayLike An array-like object to convert to an array.
+   * @param arrayLike An array-like or iterable object to convert to an array.
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
   ): Float64Array<ArrayBuffer>;
 }
 declare var Float64Array: Float64ArrayConstructor;
 
@@ -5609,4 +5556,33 @@
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
