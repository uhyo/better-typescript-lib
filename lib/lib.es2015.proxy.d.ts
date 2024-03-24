interface ProxyHandler<T extends object> {
  /**
   * A trap method for a function call.
   * @param target The original callable object which is being proxied.
   */
  apply?(target: T, thisArg: unknown, argArray: unknown[]): any;
  /**
   * A trap for the `new` operator.
   * @param target The original object which is being proxied.
   * @param newTarget The constructor that was originally called.
   */
  construct?(target: T, argArray: unknown[], newTarget: unknown): object;
  /**
   * A trap for getting a property value.
   * @param target The original object which is being proxied.
   * @param p The name or `Symbol` of the property to get.
   * @param receiver The proxy or an object that inherits from the proxy.
   */
  get?(target: T, p: string | symbol, receiver: unknown): any;
  /**
   * A trap for setting a property value.
   * @param target The original object which is being proxied.
   * @param p The name or `Symbol` of the property to set.
   * @param receiver The object to which the assignment was originally directed.
   * @returns A `Boolean` indicating whether or not the property was set.
   */
  set?(
    target: T,
    p: string | symbol,
    value: unknown,
    receiver: unknown,
  ): boolean;
}
