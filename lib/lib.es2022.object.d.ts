interface ObjectConstructor {
  /**
   * Determines whether an object has a property with the specified name.
   * @param o An object.
   * @param v A property name.
   */
  hasOwn<Obj extends object, Key extends PropertyKey>(
    o: Obj,
    v: Key
  ): o is Obj &
    (string extends Key
      ? {}
      : number extends Key
      ? {}
      : symbol extends Key
      ? {}
      : Key extends PropertyKey
      ? { [key in Key]: unknown }
      : {});
}
