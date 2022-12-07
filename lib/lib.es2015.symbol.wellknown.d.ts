interface Array<T> {
  /**
   * Returns an object whose properties have the value 'true'
   * when they will be absent when used in a 'with' statement.
   */
  readonly [Symbol.unscopables]: { [key: PropertyKey]: boolean };
}

interface RegExp {
  /**
   * Replaces text in a string, using this regular expression.
   * @param string A String object or string literal whose contents matching against
   *               this regular expression will be replaced
   * @param replaceValue A String object or string literal containing the text to replace for every
   *                     successful match of this regular expression.
   */
  [Symbol.replace](string: string, replaceValue: string): string;

  /**
   * Replaces text in a string, using this regular expression.
   * @param string A String object or string literal whose contents matching against
   *               this regular expression will be replaced
   * @param replacer A function that returns the replacement text.
   */
  [Symbol.replace](
    string: string,
    replacer: (
      substring: string,
      // TODO: could be improved, but blocked by issue:
      // https://github.com/microsoft/TypeScript/issues/45972
      ...rest: (string | number)[]
    ) => string
  ): string;
}

interface String {
  /**
   * Passes a string and {@linkcode replaceValue} to the `[Symbol.replace]` method on {@linkcode searchValue}. This method is expected to implement its own replacement algorithm.
   * @param searchValue An object that supports searching for and replacing matches within a string.
   * @param replaceValue The replacement text.
   */
  replace(
    searchValue: {
      [Symbol.replace](string: string, replaceValue: string): string;
    },
    replaceValue: string
  ): string;

  /**
   * Replaces text in a string, using an object that supports replacement within a string.
   * @param searchValue A object can search for and replace matches within a string.
   * @param replacer A function that returns the replacement text.
   */
  replace(
    searchValue: {
      [Symbol.replace](
        string: string,
        replacer: (substring: string, ...rest: (string | number)[]) => string
      ): string;
    },
    replacer: (substring: string, ...rest: (string | number)[]) => string
  ): string;
}
