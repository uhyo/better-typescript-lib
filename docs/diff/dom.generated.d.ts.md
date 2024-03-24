# dom.generated.d.ts Diffs

```diff
Index: dom.generated.d.ts
===================================================================
--- dom.generated.d.ts
+++ dom.generated.d.ts
@@ -2944,11 +2944,16 @@
 };
 
 /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/AudioParamMap) */
 interface AudioParamMap {
-  forEach(
-    callbackfn: (value: AudioParam, key: string, parent: AudioParamMap) => void,
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: AudioParam,
+      key: string,
+      parent: this,
+    ) => void,
+    thisArg?: This,
   ): void;
 }
 
 declare var AudioParamMap: {
@@ -3369,9 +3374,9 @@
   blob(): Promise<Blob>;
   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/formData) */
   formData(): Promise<FormData>;
   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/json) */
-  json(): Promise<any>;
+  json(): Promise<JSONValue>;
   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/text) */
   text(): Promise<string>;
 }
 
@@ -8872,11 +8877,11 @@
 };
 
 /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventCounts) */
 interface EventCounts {
-  forEach(
-    callbackfn: (value: number, key: string, parent: EventCounts) => void,
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, key: string, parent: this) => void,
+    thisArg?: This,
   ): void;
 }
 
 declare var EventCounts: {
@@ -9420,11 +9425,16 @@
   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FontFaceSet/check) */
   check(font: string, text?: string): boolean;
   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FontFaceSet/load) */
   load(font: string, text?: string): Promise<FontFace[]>;
-  forEach(
-    callbackfn: (value: FontFace, key: FontFace, parent: FontFaceSet) => void,
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: FontFace,
+      key: FontFace,
+      parent: this,
+    ) => void,
+    thisArg?: This,
   ): void;
   addEventListener<K extends keyof FontFaceSetEventMap>(
     type: K,
     listener: (this: FontFaceSet, ev: FontFaceSetEventMap[K]) => any,
@@ -17139,11 +17149,16 @@
  *
  * [MDN Reference](https://developer.mozilla.org/docs/Web/API/MIDIInputMap)
  */
 interface MIDIInputMap {
-  forEach(
-    callbackfn: (value: MIDIInput, key: string, parent: MIDIInputMap) => void,
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: MIDIInput,
+      key: string,
+      parent: this,
+    ) => void,
+    thisArg?: This,
   ): void;
 }
 
 declare var MIDIInputMap: {
@@ -17206,11 +17221,16 @@
  *
  * [MDN Reference](https://developer.mozilla.org/docs/Web/API/MIDIOutputMap)
  */
 interface MIDIOutputMap {
-  forEach(
-    callbackfn: (value: MIDIOutput, key: string, parent: MIDIOutputMap) => void,
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: MIDIOutput,
+      key: string,
+      parent: this,
+    ) => void,
+    thisArg?: This,
   ): void;
 }
 
 declare var MIDIOutputMap: {
@@ -21527,11 +21547,11 @@
 };
 
 /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/RTCStatsReport) */
 interface RTCStatsReport {
-  forEach(
-    callbackfn: (value: any, key: string, parent: RTCStatsReport) => void,
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: unknown, key: string, parent: this) => void,
+    thisArg?: This,
   ): void;
 }
 
 declare var RTCStatsReport: {
@@ -34291,13 +34311,16 @@
   handler: TimerHandler,
   timeout?: number,
   ...arguments: any[]
 ): number;
+
 /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/structuredClone) */
-declare function structuredClone<T = any>(
+declare function structuredClone<
+  const T extends BetterTypeScriptLibInternals.StructuredClone.Constraint<T>,
+>(
   value: T,
   options?: StructuredSerializeOptions,
-): T;
+): BetterTypeScriptLibInternals.StructuredClone.StructuredCloneOutput<T>;
 /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/sessionStorage) */
 declare var sessionStorage: Storage;
 declare function addEventListener<K extends keyof WindowEventMap>(
   type: K,
@@ -34956,4 +34979,125 @@
   | "blob"
   | "document"
   | "json"
   | "text";
+// --------------------
+
+declare namespace BetterTypeScriptLibInternals {
+  export namespace StructuredClone {
+    type Basics = [
+      EvalError,
+      RangeError,
+      ReferenceError,
+      TypeError,
+      SyntaxError,
+      URIError,
+      Error,
+      Boolean,
+      String,
+      Date,
+      RegExp,
+    ];
+    type DOMSpecifics = [
+      DOMException,
+      DOMMatrix,
+      DOMMatrixReadOnly,
+      DOMPoint,
+      DOMPointReadOnly,
+      DOMQuad,
+      DOMRect,
+      DOMRectReadOnly,
+    ];
+    type FileSystemTypeFamily = [
+      FileSystemDirectoryHandle,
+      FileSystemFileHandle,
+      FileSystemHandle,
+    ];
+    type WebGPURelatedTypeFamily = [
+      // GPUCompilationInfo,
+      // GPUCompilationMessage,
+    ];
+    type TypedArrayFamily = [
+      Int8Array,
+      Int16Array,
+      Int32Array,
+      BigInt64Array,
+      Uint8Array,
+      Uint16Array,
+      Uint32Array,
+      BigUint64Array,
+      Uint8ClampedArray,
+    ];
+    type Weaken = [
+      ...Basics,
+      // AudioData,
+      Blob,
+      // CropTarget,
+      // CryptoTarget,
+      ...DOMSpecifics,
+      ...FileSystemTypeFamily,
+      ...WebGPURelatedTypeFamily,
+      File,
+      FileList,
+      ...TypedArrayFamily,
+      DataView,
+      ImageBitmap,
+      ImageData,
+      RTCCertificate,
+      VideoFrame,
+    ];
+
+    type MapSubtype<R> = {
+      [k in keyof Weaken]: R extends Weaken[k] ? true : false;
+    };
+    type SelectNumericLiteral<H> = number extends H ? never : H;
+    type FilterByNumericLiteralKey<R extends Record<string | number, any>> = {
+      [k in keyof R as `${R[k] extends true ? Exclude<SelectNumericLiteral<k>, symbol> : never}`]: [];
+    };
+    type HitWeakenEntry<E> = keyof FilterByNumericLiteralKey<MapSubtype<E>>;
+
+    type NonCloneablePrimitive =
+      | Function
+      | { new (...args: any[]): any }
+      | ((...args: any[]) => any)
+      | symbol;
+
+    type StructuredCloneOutputObject<T> = {
+      -readonly [K in Exclude<keyof T, symbol> as [
+        StructuredCloneOutput<T[K]>,
+      ] extends [never]
+        ? never
+        : K]: StructuredCloneOutput<T[K]>;
+    };
+
+    type StructuredCloneOutput<T> = T extends NonCloneablePrimitive
+      ? never
+      : T extends ReadonlyArray<any>
+        ? number extends T["length"]
+          ? Array<StructuredCloneOutput<T[number]>>
+          : T extends readonly [infer X, ...infer XS]
+            ? [StructuredCloneOutput<X>, ...StructuredCloneOutput<XS>]
+            : T extends []
+              ? []
+              : StructuredCloneOutputObject<T>
+        : T extends Map<infer K, infer V>
+          ? Map<StructuredCloneOutput<K>, StructuredCloneOutput<V>>
+          : T extends Set<infer E>
+            ? Set<StructuredCloneOutput<E>>
+            : T extends Record<any, any>
+              ? HitWeakenEntry<T> extends never
+                ? StructuredCloneOutputObject<T>
+                : Weaken[HitWeakenEntry<T>]
+              : T;
+
+    type AvoidCyclicConstraint<T> = [T] extends [infer R] ? R : never;
+
+    type NeverOrUnknown<T> = [T] extends [never] ? never : unknown;
+
+    export type Constraint<T> =
+      BetterTypeScriptLibInternals.StructuredClone.NeverOrUnknown<
+        BetterTypeScriptLibInternals.StructuredClone.StructuredCloneOutput<
+          BetterTypeScriptLibInternals.StructuredClone.AvoidCyclicConstraint<T>
+        >
+      >;
+  }
+}

```
