# esnext.intl.d.ts Diffs

```diff
Index: esnext.intl.d.ts
===================================================================
--- esnext.intl.d.ts
+++ esnext.intl.d.ts
@@ -1,4 +1,5 @@
+/// <reference no-default-lib="true"/>
 declare namespace Intl {
   interface NumberRangeFormatPart extends NumberFormatPart {
     source: "startRange" | "endRange" | "shared";
   }

```
