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
      parent: this
    ) => void,
    thisArg?: This
  ): void;
}

interface EventCounts {
  forEach<This = undefined>(
    callbackfn: (this: This, value: number, key: string, parent: this) => void,
    thisArg?: This
  ): void;
}

/** Available only in secure contexts. */
interface MIDIInputMap {
  forEach<This = undefined>(
    callbackfn: (
      this: This,
      value: MIDIInput,
      key: string,
      parent: this
    ) => void,
    thisArg?: This
  ): void;
}

/** Available only in secure contexts. */
interface MIDIOutputMap {
  forEach<This = undefined>(
    callbackfn: (
      this: This,
      value: MIDIOutput,
      key: string,
      parent: this
    ) => void,
    thisArg?: This
  ): void;
}

interface RTCStatsReport {
  forEach<This = undefined>(
    callbackfn: (this: This, value: unknown, key: string, parent: this) => void,
    thisArg?: This
  ): void;
}

interface FontFaceSet extends EventTarget {
  forEach<This = undefined>(
    callbackfn: (
      this: This,
      value: FontFace,
      key: FontFace,
      parent: this
    ) => void,
    thisArg?: This
  ): void;
}
