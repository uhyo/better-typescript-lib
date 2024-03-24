# dom.generated.d.ts Diffs

```diff
Index: dom.generated.d.ts
===================================================================
--- dom.generated.d.ts
+++ dom.generated.d.ts
@@ -2943,11 +2943,16 @@
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
@@ -3364,9 +3369,9 @@
   blob(): Promise<Blob>;
   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/formData) */
   formData(): Promise<FormData>;
   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/json) */
-  json(): Promise<any>;
+  json(): Promise<JSONValue>;
   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/text) */
   text(): Promise<string>;
 }
 
@@ -8828,11 +8833,11 @@
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
@@ -9374,11 +9379,16 @@
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
@@ -17020,11 +17030,16 @@
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
@@ -17087,11 +17102,16 @@
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
@@ -21372,11 +21392,11 @@
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
@@ -34051,13 +34071,20 @@
   handler: TimerHandler,
   timeout?: number,
   ...arguments: any[]
 ): number;
+
 /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/structuredClone) */
-declare function structuredClone<T = any>(
+declare function structuredClone<
+  const T extends BetterTypeScriptLibInternals.StructuredClone.NeverOrUnknown<
+    BetterTypeScriptLibInternals.StructuredClone.StructuredCloneOutput<
+      BetterTypeScriptLibInternals.StructuredClone.AvoidCyclicConstraint<T>
+    >
+  >,
+>(
   value: T,
   options?: StructuredSerializeOptions,
-): T;
+): BetterTypeScriptLibInternals.StructuredClone.StructuredCloneOutput<T>;
 /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/sessionStorage) */
 declare var sessionStorage: Storage;
 declare function addEventListener<K extends keyof WindowEventMap>(
   type: K,
@@ -34712,4 +34739,119 @@
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
+    // 上限が不正にきつくなっているのを無視する
+    type NeverOrUnknown<T> = [T] extends [never] ? never : unknown;
+  }
+}

```
