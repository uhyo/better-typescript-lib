# es5.d.ts Diffs

```diff
Index: es5.d.ts
===================================================================
--- es5.d.ts
+++ es5.d.ts
@@ -1,4 +1,19 @@
+type UnionToIntersection<T> = (
+  T extends any ? (arg: T) => void : never
+) extends (arg: infer F) => void
+  ? F
+  : unknown;
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
 
@@ -8,9 +23,9 @@
 /**
  * Evaluates JavaScript code and executes it.
  * @param x A String value that contains valid JavaScript code.
  */
-declare function eval(x: string): any;
+declare function eval(x: string): unknown;
 
 /**
  * Converts a string to an integer.
  * @param string A string to convert into a number.
@@ -117,9 +132,19 @@
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
@@ -132,21 +157,26 @@
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
@@ -168,41 +198,65 @@
   /**
    * Creates an object that has the specified prototype or that has null prototype.
    * @param o Object to use as a prototype. May be null.
    */
-  create(o: object | null): any;
+  create(o: object | null): {};
 
   /**
    * Creates an object that has the specified prototype, and that optionally contains specified properties.
    * @param o Object to use as a prototype. May be null
    * @param properties JavaScript object that contains one or more property descriptors.
    */
-  create(
+  create<P extends Record<string, PropertyDescriptor>>(
     o: object | null,
-    properties: PropertyDescriptorMap & ThisType<any>
-  ): any;
+    properties: P & ThisType<any>
+  ): {
+    [K in keyof P]: P[K] extends { value: infer V }
+      ? V
+      : P[K] extends { get: () => infer V }
+      ? V
+      : unknown;
+  };
 
   /**
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
+  defineProperty<O, K extends PropertyKey, D extends PropertyDescriptor>(
+    o: O,
+    p: K,
+    attributes: D & ThisType<any>
+  ): O &
+    (K extends PropertyKey
+      ? Record<
+          K,
+          D extends { value: infer V }
+            ? V
+            : D extends { get: () => infer V }
+            ? V
+            : unknown
+        >
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
+  defineProperties<O, P extends Record<PropertyKey, PropertyDescriptor>>(
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
@@ -210,15 +264,15 @@
   seal<T>(o: T): T;
 
   /**
    * Prevents the modification of existing property attributes and values, and prevents the addition of new properties.
-   * @param a Object on which to lock the attributes.
+   * @param o Object on which to lock the attributes.
    */
   freeze<T>(a: T[]): readonly T[];
 
   /**
    * Prevents the modification of existing property attributes and values, and prevents the addition of new properties.
-   * @param f Object on which to lock the attributes.
+   * @param o Object on which to lock the attributes.
    */
   freeze<T extends Function>(f: T): T;
 
   /**
@@ -258,13 +312,8 @@
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
@@ -357,40 +406,13 @@
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
@@ -456,9 +478,9 @@
   ): new (...args: AX[]) => R;
 }
 
 interface IArguments {
-  [index: number]: any;
+  [index: number]: unknown;
   length: number;
   callee: Function;
 }
 
@@ -1187,43 +1209,60 @@
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
+    space?: string | number
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
+    value: unknown,
+    replacer?: (this: unknown, key: string, value: unknown) => any,
     space?: string | number
-  ): string;
+  ): string | undefined;
   /**
    * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
    * @param value A JavaScript value, usually an object or array, to be converted.
-   * @param replacer An array of strings and numbers that acts as an approved list for selecting the object properties that will be stringified.
+   * @param replacer An array of strings and numbers that acts as a approved list for selecting the object properties that will be stringified.
    * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
    */
   stringify(
-    value: any,
+    value: unknown,
     replacer?: (number | string)[] | null,
     space?: string | number
-  ): string;
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
@@ -1289,9 +1328,9 @@
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
   every(
-    predicate: (value: T, index: number, array: readonly T[]) => unknown,
+    predicate: (value: T, index: number, array: readonly T[]) => boolean,
     thisArg?: any
   ): boolean;
   /**
    * Determines whether the specified callback function returns true for any element of an array.
@@ -1301,9 +1340,9 @@
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
   some(
-    predicate: (value: T, index: number, array: readonly T[]) => unknown,
+    predicate: (value: T, index: number, array: readonly T[]) => boolean,
     thisArg?: any
   ): boolean;
   /**
    * Performs the specified action for each element in an array.
@@ -1337,9 +1376,9 @@
    * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
    */
   filter(
-    predicate: (value: T, index: number, array: readonly T[]) => unknown,
+    predicate: (value: T, index: number, array: readonly T[]) => boolean,
     thisArg?: any
   ): T[];
   /**
    * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
@@ -1547,9 +1586,9 @@
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
   every(
-    predicate: (value: T, index: number, array: T[]) => unknown,
+    predicate: (value: T, index: number, array: T[]) => boolean,
     thisArg?: any
   ): boolean;
   /**
    * Determines whether the specified callback function returns true for any element of an array.
@@ -1559,9 +1598,9 @@
    * @param thisArg An object to which the this keyword can refer in the predicate function.
    * If thisArg is omitted, undefined is used as the this value.
    */
   some(
-    predicate: (value: T, index: number, array: T[]) => unknown,
+    predicate: (value: T, index: number, array: T[]) => boolean,
     thisArg?: any
   ): boolean;
   /**
    * Performs the specified action for each element in an array.
@@ -1595,9 +1634,9 @@
    * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
    * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
    */
   filter(
-    predicate: (value: T, index: number, array: T[]) => unknown,
+    predicate: (value: T, index: number, array: T[]) => boolean,
     thisArg?: any
   ): T[];
   /**
    * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
@@ -1674,21 +1713,19 @@
 
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
@@ -1716,9 +1753,15 @@
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
 

```
