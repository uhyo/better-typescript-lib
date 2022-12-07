declare namespace Reflect {
  /**
   * Gets the property of target, equivalent to `target[propertyKey]` when `receiver === target`.
   * @param target Object that contains the property on itself or in its prototype chain.
   * @param propertyKey The property name.
   * @param receiver The reference to use as the `this` value in the getter function,
   *        if `target[propertyKey]` is an accessor property.
   */
  function get<T, P extends PropertyKey>(
    target: T,
    propertyKey: P,
    receiver?: unknown
  ): P extends keyof T ? T[P] : unknown;
}
