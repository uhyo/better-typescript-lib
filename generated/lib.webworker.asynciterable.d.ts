/// <reference no-default-lib="true"/>
/////////////////////////////
/// Worker Async Iterable APIs
/////////////////////////////

interface FileSystemDirectoryHandle {
  [Symbol.asyncIterator](): AsyncIterableIterator<[string, FileSystemHandle]>;
  entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
  keys(): AsyncIterableIterator<string>;
  values(): AsyncIterableIterator<FileSystemHandle>;
}
