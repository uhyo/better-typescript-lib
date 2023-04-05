# dom.generated.d.ts Diffs

```diff
Index: dom.generated.d.ts
===================================================================
--- dom.generated.d.ts
+++ dom.generated.d.ts
@@ -1,4 +1,5 @@
+/// <reference no-default-lib="true"/>
 /////////////////////////////
 /// Window APIs
 /////////////////////////////
 
@@ -2800,9 +2801,9 @@
   readonly bodyUsed: boolean;
   arrayBuffer(): Promise<ArrayBuffer>;
   blob(): Promise<Blob>;
   formData(): Promise<FormData>;
-  json(): Promise<any>;
+  json(): Promise<JSONValue>;
   text(): Promise<string>;
 }
 
 interface BroadcastChannelEventMap {

```
