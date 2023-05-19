# dom.generated.d.ts Diffs

```diff
Index: dom.generated.d.ts
===================================================================
--- dom.generated.d.ts
+++ dom.generated.d.ts
@@ -2515,11 +2515,16 @@
   new (): AudioParam;
 };
 
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
@@ -2821,9 +2826,9 @@
   readonly bodyUsed: boolean;
   arrayBuffer(): Promise<ArrayBuffer>;
   blob(): Promise<Blob>;
   formData(): Promise<FormData>;
-  json(): Promise<any>;
+  json(): Promise<JSONValue>;
   text(): Promise<string>;
 }
 
 interface BroadcastChannelEventMap {
@@ -5948,11 +5953,11 @@
   readonly BUBBLING_PHASE: 3;
 };
 
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
@@ -6328,11 +6333,16 @@
   readonly ready: Promise<FontFaceSet>;
   readonly status: FontFaceSetLoadStatus;
   check(font: string, text?: string): boolean;
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
@@ -11689,11 +11699,16 @@
 };
 
 /** Available only in secure contexts. */
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
@@ -11742,11 +11757,16 @@
 };
 
 /** Available only in secure contexts. */
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
@@ -14680,11 +14700,11 @@
   new (descriptionInitDict: RTCSessionDescriptionInit): RTCSessionDescription;
 };
 
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
