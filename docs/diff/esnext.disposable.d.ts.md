# esnext.disposable.d.ts Diffs

```diff
Index: esnext.disposable.d.ts
===================================================================
--- esnext.disposable.d.ts
+++ esnext.disposable.d.ts
@@ -20,10 +20,10 @@
   [Symbol.asyncDispose](): PromiseLike<void>;
 }
 
 interface SuppressedError extends Error {
-  error: any;
-  suppressed: any;
+  error: unknown;
+  suppressed: unknown;
 }
 
 interface SuppressedErrorConstructor {
   new (error: any, suppressed: any, message?: string): SuppressedError;

```
