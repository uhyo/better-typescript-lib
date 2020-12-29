/// <reference no-default-lib="true"/>

interface ProxyHandler<T extends object> {
  getPrototypeOf?(target: T): object | null;
  setPrototypeOf?(target: T, v: unknown): boolean;
  isExtensible?(target: T): boolean;
  preventExtensions?(target: T): boolean;
  getOwnPropertyDescriptor?(
    target: T,
    p: PropertyKey
  ): PropertyDescriptor | undefined;
  has?(target: T, p: PropertyKey): boolean;
  get?(target: T, p: PropertyKey, receiver: unknown): any;
  set?(target: T, p: PropertyKey, value: unknown, receiver: unknown): boolean;
  deleteProperty?(target: T, p: PropertyKey): boolean;
  defineProperty?(
    target: T,
    p: PropertyKey,
    attributes: PropertyDescriptor
  ): boolean;
  enumerate?(target: T): PropertyKey[];
  ownKeys?(target: T): PropertyKey[];
  apply?(target: T, thisArg: unknown, argArray: unknown[]): any;
  construct?(target: T, argArray: unknown[], newTarget: unknown): object;
}
