# dom.iterable.d.ts Diffs

```diff
Index: dom.iterable.d.ts
===================================================================
--- dom.iterable.d.ts
+++ dom.iterable.d.ts
@@ -1,4 +1,5 @@
+/// <reference no-default-lib="true"/>
 /// <reference lib="dom" />
 
 interface DOMTokenList {
   [Symbol.iterator](): IterableIterator<string>;

```
