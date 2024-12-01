# dom.generated.d.ts Diffs

```diff
Index: dom.generated.d.ts
===================================================================
--- dom.generated.d.ts
+++ dom.generated.d.ts
@@ -3293,11 +3293,16 @@
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
@@ -3726,9 +3731,9 @@
   bytes(): Promise<Uint8Array>;
   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/formData) */
   formData(): Promise<FormData>;
   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/json) */
-  json(): Promise<any>;
+  json(): Promise<JSONValue>;
   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/text) */
   text(): Promise<string>;
 }
 
@@ -6927,11 +6932,11 @@
 };
 
 /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CustomStateSet) */
 interface CustomStateSet {
-  forEach(
-    callbackfn: (value: string, key: string, parent: CustomStateSet) => void,
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: string, key: string, parent: this) => void,
+    thisArg?: This,
   ): void;
 }
 
 declare var CustomStateSet: {
@@ -9378,11 +9383,11 @@
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
@@ -9914,11 +9919,16 @@
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
@@ -16210,15 +16220,16 @@
   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Highlight/priority) */
   priority: number;
   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Highlight/type) */
   type: HighlightType;
-  forEach(
+  forEach<This = undefined>(
     callbackfn: (
+      this: This,
       value: AbstractRange,
       key: AbstractRange,
-      parent: Highlight,
+      parent: this,
     ) => void,
-    thisArg?: any,
+    thisArg?: This,
   ): void;
 }
 
 declare var Highlight: {
@@ -16227,15 +16238,16 @@
 };
 
 /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HighlightRegistry) */
 interface HighlightRegistry {
-  forEach(
+  forEach<This = undefined>(
     callbackfn: (
+      this: This,
       value: Highlight,
       key: string,
-      parent: HighlightRegistry,
+      parent: this,
     ) => void,
-    thisArg?: any,
+    thisArg?: This,
   ): void;
 }
 
 declare var HighlightRegistry: {
@@ -17663,11 +17675,16 @@
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
@@ -17730,11 +17747,16 @@
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
@@ -19528,9 +19550,9 @@
   new (): NodeList;
 };
 
 interface NodeListOf<TNode extends Node> extends NodeList {
-  item(index: number): TNode;
+  item(index: number): TNode | null;
   /**
    * Performs the specified action for each node in an list.
    * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the list.
    * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
@@ -22073,11 +22095,11 @@
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
@@ -34926,13 +34948,16 @@
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
@@ -35607,4 +35632,125 @@
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
