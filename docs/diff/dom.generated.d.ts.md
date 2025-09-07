# dom.generated.d.ts Diffs

```diff
Index: dom.generated.d.ts
===================================================================
--- dom.generated.d.ts
+++ dom.generated.d.ts
@@ -4053,11 +4053,16 @@
  *
  * [MDN Reference](https://developer.mozilla.org/docs/Web/API/AudioParamMap)
  */
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
@@ -4721,9 +4726,9 @@
   bytes(): Promise<Uint8Array<ArrayBuffer>>;
   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/formData) */
   formData(): Promise<FormData>;
   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/json) */
-  json(): Promise<any>;
+  json(): Promise<JSONValue>;
   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/text) */
   text(): Promise<string>;
 }
 
@@ -9110,11 +9115,11 @@
  *
  * [MDN Reference](https://developer.mozilla.org/docs/Web/API/CustomStateSet)
  */
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
@@ -10953,10 +10958,14 @@
    *
    * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/exitPointerLock)
    */
   exitPointerLock(): void;
-  getElementById(elementId: string): HTMLElement | null;
   /**
+   * Returns a reference to the first object with the specified value of the ID attribute.
+   * @param elementId String that specifies the ID value.
+   */
+  getElementById(elementId: string): Element | null;
+  /**
    * The **`getElementsByClassName`** method of of all child elements which have all of the given class name(s).
    *
    * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/getElementsByClassName)
    */
@@ -11133,9 +11142,9 @@
  * [MDN Reference](https://developer.mozilla.org/docs/Web/API/DocumentFragment)
  */
 interface DocumentFragment extends Node, NonElementParentNode, ParentNode {
   readonly ownerDocument: Document;
-  getElementById(elementId: string): HTMLElement | null;
+  getElementById(elementId: string): Element | null;
   /** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) */
   get textContent(): string;
   set textContent(value: string | null);
 }
@@ -12257,11 +12266,11 @@
  *
  * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventCounts)
  */
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
@@ -13038,11 +13047,16 @@
    *
    * [MDN Reference](https://developer.mozilla.org/docs/Web/API/FontFaceSet/load)
    */
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
@@ -20056,15 +20070,16 @@
    *
    * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Highlight/type)
    */
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
@@ -20077,15 +20092,16 @@
  *
  * [MDN Reference](https://developer.mozilla.org/docs/Web/API/HighlightRegistry)
  */
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
@@ -21942,11 +21958,16 @@
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
@@ -22020,11 +22041,16 @@
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
@@ -24447,13 +24473,13 @@
    * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/ownerDocument)
    */
   readonly ownerDocument: Document | null;
   /**
-   * The read-only **`parentElement`** property of Node interface returns the DOM node's parent Element, or `null` if the node either has no parent, or its parent isn't a DOM Element.
+   * Returns the parent element.
    *
    * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/parentElement)
    */
-  readonly parentElement: HTMLElement | null;
+  readonly parentElement: Element | null;
   /**
    * The read-only **`parentNode`** property of the Node interface returns the parent of the specified node in the DOM tree.
    *
    * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/parentNode)
@@ -24722,9 +24748,9 @@
   new (): NodeList;
 };
 
 interface NodeListOf<TNode extends Node> extends NodeList {
-  item(index: number): TNode;
+  item(index: number): TNode | null;
   forEach(
     callbackfn: (value: TNode, key: number, parent: NodeListOf<TNode>) => void,
     thisArg?: any,
   ): void;
@@ -28693,11 +28719,11 @@
  *
  * [MDN Reference](https://developer.mozilla.org/docs/Web/API/RTCStatsReport)
  */
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
@@ -38390,15 +38416,11 @@
   new (): ViewTransition;
 };
 
 interface ViewTransitionTypeSet {
-  forEach(
-    callbackfn: (
-      value: string,
-      key: string,
-      parent: ViewTransitionTypeSet,
-    ) => void,
-    thisArg?: any,
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: string, key: string, parent: this) => void,
+    thisArg?: This,
   ): void;
 }
 
 declare var ViewTransitionTypeSet: {
@@ -45428,13 +45450,16 @@
   handler: TimerHandler,
   timeout?: number,
   ...arguments: any[]
 ): number;
-/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Window/structuredClone) */
-declare function structuredClone<T = any>(
+
+/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/structuredClone) */
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
@@ -46126,4 +46151,125 @@
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
