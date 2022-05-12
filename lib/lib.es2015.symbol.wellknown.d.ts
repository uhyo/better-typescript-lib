/// <reference no-default-lib="true"/>

interface Array<T> {
  /**
   * Returns an object whose properties have the value 'true'
   * when they will be absent when used in a 'with' statement.
   */
  readonly [Symbol.unscopables]: { [key: PropertyKey]: boolean };
}

interface RegExp {
  /**
   * Matches a string with this regular expression, and returns an array containing the results of
   * that search.
   * @param string A string to search within.
   */
  [Symbol.match](string: string): RegExpMatchArray | null;

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

  /**
   * Finds the position beginning first substring match in a regular expression search
   * using this regular expression.
   *
   * @param string The string to search within.
   */
  [Symbol.search](string: string): number;

  /**
   * Returns an array of substrings that were delimited by strings in the original input that
   * match against this regular expression.
   *
   * If the regular expression contains capturing parentheses, then each time this
   * regular expression matches, the results (including any undefined results) of the
   * capturing parentheses are spliced.
   *
   * @param string string value to split
   * @param limit if not undefined, the output array is truncated so that it contains no more
   * than 'limit' elements.
   */
  [Symbol.split](string: string, limit?: number): string[];
}

interface String {
  /**
   * Matches a string or an object that supports being matched against, and returns an array
   * containing the results of that search, or null if no matches are found.
   * @param matcher An object that supports being matched against.
   */
  match(matcher: {
    [Symbol.match](string: string): RegExpMatchArray | null;
  }): RegExpMatchArray | null;

  /**
   * Replaces first match with string or all matches with RegExp.
   * @param searchValue A object can search for and replace matches within a string.
   * @param replaceValue A string containing the text to replace for match.
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

  /**
   * Finds the first substring match in a regular expression search.
   * @param searcher An object which supports searching within a string.
   */
  search(searcher: { [Symbol.search](string: string): number }): number;

  /**
   * Split a string into substrings using the specified separator and return them as an array.
   * @param splitter An object that can split a string.
   * @param limit A value used to limit the number of elements returned in the array.
   */
  split(
    splitter: { [Symbol.split](string: string, limit?: number): string[] },
    limit?: number
  ): string[];
}
