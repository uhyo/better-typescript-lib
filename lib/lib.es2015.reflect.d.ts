/// <reference no-default-lib="true"/>

declare namespace Reflect {
  function apply(
    target: Function,
    thisArgument: any,
    argumentsList: ArrayLike<any>
  ): unknown;
  function construct(
    target: Function,
    argumentsList: ArrayLike<any>,
    newTarget?: any
  ): object;
  function defineProperty(
    target: object,
    propertyKey: PropertyKey,
    attributes: PropertyDescriptor
  ): boolean;
  function deleteProperty(target: object, propertyKey: PropertyKey): boolean;
  function get<T, K extends PropertyKey>(
    target: T,
    propertyKey: K,
    receiver?: any
  ): K extends keyof T ? T[K] : unknown;
  function getOwnPropertyDescriptor(
    target: object,
    propertyKey: PropertyKey
  ): PropertyDescriptor | undefined;
  function getPrototypeOf(target: object): object;
  function has(target: object, propertyKey: PropertyKey): boolean;
  function isExtensible(target: object): boolean;
  function ownKeys(target: object): PropertyKey[];
  function preventExtensions(target: object): boolean;
  function set(
    target: object,
    propertyKey: PropertyKey,
    value: any,
    receiver?: any
  ): boolean;
  function setPrototypeOf(target: object, proto: any): boolean;
}
