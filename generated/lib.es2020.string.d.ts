/// <reference path="./lib.es2015.iterable.d.ts" />

interface String {
    /**
     * Matches a string with a regular expression, and returns an iterable of matches
     * containing the results of that search.
     * @param regexp A variable name or string literal containing the regular expression pattern and flags.
     */
    matchAll(regexp: RegExp): IterableIterator<RegExpMatchArray>;
}
