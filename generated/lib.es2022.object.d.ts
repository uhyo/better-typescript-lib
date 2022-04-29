interface ObjectConstructor {
  /**
   * Determines whether an object has a property with the specified name.
   * @param o An object.
   * @param v A property name.
   */
  hasOwn<Key extends PropertyKey>(
    o: object,
    v: Key
  ): o is string extends Key
    ? {}
    : number extends Key
    ? {}
    : symbol extends Key
    ? {}
    : Key extends PropertyKey
    ? { [key in Key]: unknown }
    : {};
}
// --------------------

// interface ObjectConstructor {
//     /**
//      * Determines whether an object has a property with the specified name.
//      * @param o An object.
//      * @param v A property name.
//      */
//     hasOwn(o: object, v: PropertyKey): boolean;
// }

