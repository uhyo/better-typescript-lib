# dom.generated.d.ts Diffs

```diff
Index: dom.generated.d.ts
===================================================================
--- dom.generated.d.ts
+++ dom.generated.d.ts
@@ -2910,11 +2910,16 @@
 };
 
 /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/AudioParamMap) */
 interface AudioParamMap {
-  forEach(
-    callbackfn: (value: AudioParam, key: string, parent: AudioParamMap) => void,
-    thisArg?: any
+  forEach<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: AudioParam,
+      key: string,
+      parent: this
+    ) => void,
+    thisArg?: This
   ): void;
 }
 
 declare var AudioParamMap: {
@@ -3331,9 +3336,9 @@
   blob(): Promise<Blob>;
   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/formData) */
   formData(): Promise<FormData>;
   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/json) */
-  json(): Promise<any>;
+  json(): Promise<JSONValue>;
   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/text) */
   text(): Promise<string>;
 }
 
@@ -8785,11 +8790,11 @@
 };
 
 /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventCounts) */
 interface EventCounts {
-  forEach(
-    callbackfn: (value: number, key: string, parent: EventCounts) => void,
-    thisArg?: any
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: number, key: string, parent: this) => void,
+    thisArg?: This
   ): void;
 }
 
 declare var EventCounts: {
@@ -9331,11 +9336,16 @@
   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FontFaceSet/check) */
   check(font: string, text?: string): boolean;
   /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/FontFaceSet/load) */
   load(font: string, text?: string): Promise<FontFace[]>;
-  forEach(
-    callbackfn: (value: FontFace, key: FontFace, parent: FontFaceSet) => void,
-    thisArg?: any
+  forEach<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: FontFace,
+      key: FontFace,
+      parent: this
+    ) => void,
+    thisArg?: This
   ): void;
   addEventListener<K extends keyof FontFaceSetEventMap>(
     type: K,
     listener: (this: FontFaceSet, ev: FontFaceSetEventMap[K]) => any,
@@ -16961,11 +16971,16 @@
  *
  * [MDN Reference](https://developer.mozilla.org/docs/Web/API/MIDIInputMap)
  */
 interface MIDIInputMap {
-  forEach(
-    callbackfn: (value: MIDIInput, key: string, parent: MIDIInputMap) => void,
-    thisArg?: any
+  forEach<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: MIDIInput,
+      key: string,
+      parent: this
+    ) => void,
+    thisArg?: This
   ): void;
 }
 
 declare var MIDIInputMap: {
@@ -17028,11 +17043,16 @@
  *
  * [MDN Reference](https://developer.mozilla.org/docs/Web/API/MIDIOutputMap)
  */
 interface MIDIOutputMap {
-  forEach(
-    callbackfn: (value: MIDIOutput, key: string, parent: MIDIOutputMap) => void,
-    thisArg?: any
+  forEach<This = undefined>(
+    callbackfn: (
+      this: This,
+      value: MIDIOutput,
+      key: string,
+      parent: this
+    ) => void,
+    thisArg?: This
   ): void;
 }
 
 declare var MIDIOutputMap: {
@@ -21304,11 +21324,11 @@
 };
 
 /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/RTCStatsReport) */
 interface RTCStatsReport {
-  forEach(
-    callbackfn: (value: any, key: string, parent: RTCStatsReport) => void,
-    thisArg?: any
+  forEach<This = undefined>(
+    callbackfn: (this: This, value: unknown, key: string, parent: this) => void,
+    thisArg?: This
   ): void;
 }
 
 declare var RTCStatsReport: {

```
