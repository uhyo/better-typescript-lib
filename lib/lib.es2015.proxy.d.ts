/// <reference no-default-lib="true"/>

interface ProxyHandler<T extends object> {
  apply?(target: T, thisArg: unknown, argArray: unknown[]): any;
  construct?(target: T, argArray: unknown[], newTarget: unknown): object;
  defineProperty?(
    target: T,
    p: PropertyKey,
    attributes: PropertyDescriptor
  ): boolean;
  deleteProperty?(target: T, p: PropertyKey): boolean;
  get?(target: T, p: PropertyKey, receiver: unknown): any;
  getOwnPropertyDescriptor?(
    target: T,
    p: PropertyKey
  ): PropertyDescriptor | undefined;
  getPrototypeOf?(target: T): object | null;
  has?(target: T, p: PropertyKey): boolean;
  isExtensible?(target: T): boolean;
  ownKeys?(target: T): PropertyKey[];
  preventExtensions?(target: T): boolean;
  set?(target: T, p: PropertyKey, value: unknown, receiver: unknown): boolean;
  setPrototypeOf?(target: T, v: unknown): boolean;
}
