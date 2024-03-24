interface String {
  /**
   * Replace all instances of a substring in a string, using a regular expression or search string.
   * @param searchValue A string or RegExp search value.
   * @param replaceValue A string containing the text to replace for every successful match of searchValue in this string.
   */
  replaceAll(searchValue: string | RegExp, replaceValue: string): string;

  /**
   * Replace all instances of a substring in a string, using a regular expression or search string.
   * @param searchValue A string or RegExp search value.
   * @param replacer A function that returns the replacement text.
   */
  replaceAll(
    searchValue: string | RegExp,
    replacer: (
      substring: string,
      // TODO: could be improved, but blocked by issue:
      // https://github.com/microsoft/TypeScript/issues/45972
      ...rest: (string | number)[]
    ) => string,
  ): string;

  /**
   * Replace all instances of a substring in a string, using a regular expression or search string.
   * @param searchValue A object can search for and replace matches within a string.
   * @param replaceValue A string containing the text to replace for match.
   */
  replaceAll(
    searchValue: {
      [Symbol.replace](string: string, replaceValue: string): string;
    },
    replaceValue: string,
  ): string;

  /**
   * Replace all instances of a substring in a string, using a regular expression or search string.
   * @param searchValue A object can search for and replace matches within a string.
   * @param replacer A function that returns the replacement text.
   */
  replaceAll(
    searchValue: {
      [Symbol.replace](
        string: string,
        replacer: (substring: string, ...rest: (string | number)[]) => string,
      ): string;
    },
    replacer: (substring: string, ...rest: (string | number)[]) => string,
  ): string;
}
