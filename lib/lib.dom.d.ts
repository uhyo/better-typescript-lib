interface Body {
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/json) */
  json(): Promise<JSONValue>;
}

interface AudioParamMap {
  forEach<This = undefined>(
    callbackfn: (
      this: This,
      value: AudioParam,
      key: string,
      parent: this,
    ) => void,
    thisArg?: This,
  ): void;
}

interface EventCounts {
  forEach<This = undefined>(
    callbackfn: (this: This, value: number, key: string, parent: this) => void,
    thisArg?: This,
  ): void;
}

/** Available only in secure contexts. */
interface MIDIInputMap {
  forEach<This = undefined>(
    callbackfn: (
      this: This,
      value: MIDIInput,
      key: string,
      parent: this,
    ) => void,
    thisArg?: This,
  ): void;
}

/** Available only in secure contexts. */
interface MIDIOutputMap {
  forEach<This = undefined>(
    callbackfn: (
      this: This,
      value: MIDIOutput,
      key: string,
      parent: this,
    ) => void,
    thisArg?: This,
  ): void;
}

interface RTCStatsReport {
  forEach<This = undefined>(
    callbackfn: (this: This, value: unknown, key: string, parent: this) => void,
    thisArg?: This,
  ): void;
}

interface FontFaceSet extends EventTarget {
  forEach<This = undefined>(
    callbackfn: (
      this: This,
      value: FontFace,
      key: FontFace,
      parent: this,
    ) => void,
    thisArg?: This,
  ): void;
}

interface Highlight {
  forEach<This = undefined>(
    callbackfn: (
      this: This,
      value: AbstractRange,
      key: AbstractRange,
      parent: this,
    ) => void,
    thisArg?: This,
  ): void;
}

interface HighlightRegistry {
  forEach<This = undefined>(
    callbackfn: (
      this: This,
      value: Highlight,
      key: string,
      parent: this,
    ) => void,
    thisArg?: This,
  ): void;
}

declare namespace BetterTypeScriptLibInternals {
  export namespace StructuredClone {
    type Basics = [
      EvalError,
      RangeError,
      ReferenceError,
      TypeError,
      SyntaxError,
      URIError,
      Error,
      Boolean,
      String,
      Date,
      RegExp,
    ];
    type DOMSpecifics = [
      DOMException,
      DOMMatrix,
      DOMMatrixReadOnly,
      DOMPoint,
      DOMPointReadOnly,
      DOMQuad,
      DOMRect,
      DOMRectReadOnly,
    ];
    type FileSystemTypeFamily = [
      FileSystemDirectoryHandle,
      FileSystemFileHandle,
      FileSystemHandle,
    ];
    type WebGPURelatedTypeFamily = [
      // GPUCompilationInfo,
      // GPUCompilationMessage,
    ];
    type TypedArrayFamily = [
      Int8Array,
      Int16Array,
      Int32Array,
      BigInt64Array,
      Uint8Array,
      Uint16Array,
      Uint32Array,
      BigUint64Array,
      Uint8ClampedArray,
    ];
    type Weaken = [
      ...Basics,
      // AudioData,
      Blob,
      // CropTarget,
      // CryptoTarget,
      ...DOMSpecifics,
      ...FileSystemTypeFamily,
      ...WebGPURelatedTypeFamily,
      File,
      FileList,
      ...TypedArrayFamily,
      DataView,
      ImageBitmap,
      ImageData,
      RTCCertificate,
      VideoFrame,
    ];

    type MapSubtype<R> = {
      [k in keyof Weaken]: R extends Weaken[k] ? true : false;
    };
    type SelectNumericLiteral<H> = number extends H ? never : H;
    type FilterByNumericLiteralKey<R extends Record<string | number, any>> = {
      [k in keyof R as `${R[k] extends true ? Exclude<SelectNumericLiteral<k>, symbol> : never}`]: [];
    };
    type HitWeakenEntry<E> = keyof FilterByNumericLiteralKey<MapSubtype<E>>;

    type NonCloneablePrimitive =
      | Function
      | { new (...args: any[]): any }
      | ((...args: any[]) => any)
      | symbol;

    type StructuredCloneOutputObject<T> = {
      -readonly [K in Exclude<keyof T, symbol> as [
        StructuredCloneOutput<T[K]>,
      ] extends [never]
        ? never
        : K]: StructuredCloneOutput<T[K]>;
    };

    type StructuredCloneOutput<T> = T extends NonCloneablePrimitive
      ? never
      : T extends ReadonlyArray<any>
        ? number extends T["length"]
          ? Array<StructuredCloneOutput<T[number]>>
          : T extends readonly [infer X, ...infer XS]
            ? [StructuredCloneOutput<X>, ...StructuredCloneOutput<XS>]
            : T extends []
              ? []
              : StructuredCloneOutputObject<T>
        : T extends Map<infer K, infer V>
          ? Map<StructuredCloneOutput<K>, StructuredCloneOutput<V>>
          : T extends Set<infer E>
            ? Set<StructuredCloneOutput<E>>
            : T extends Record<any, any>
              ? HitWeakenEntry<T> extends never
                ? StructuredCloneOutputObject<T>
                : Weaken[HitWeakenEntry<T>]
              : T;

    type AvoidCyclicConstraint<T> = [T] extends [infer R] ? R : never;

    type NeverOrUnknown<T> = [T] extends [never] ? never : unknown;

    export type Constraint<T> =
      BetterTypeScriptLibInternals.StructuredClone.NeverOrUnknown<
        BetterTypeScriptLibInternals.StructuredClone.StructuredCloneOutput<
          BetterTypeScriptLibInternals.StructuredClone.AvoidCyclicConstraint<T>
        >
      >;
  }
}

/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/structuredClone) */
declare function structuredClone<
  const T extends BetterTypeScriptLibInternals.StructuredClone.Constraint<T>,
>(
  value: T,
  options?: StructuredSerializeOptions,
): BetterTypeScriptLibInternals.StructuredClone.StructuredCloneOutput<T>;

interface NodeListOf<TNode extends Node> extends NodeList {
  item(index: number): TNode | null;
}
