/// <reference no-default-lib="true" />

/**
 * Evaluates JavaScript code and executes it.
 * @param x A String value that contains valid JavaScript code.
 */
declare function eval(x: string): unknown;

interface ObjectConstructor {
  new (value?: any): Object;
  (): {};
  <T>(value: T): T extends object ? T : {};

  /** A reference to the prototype for a class of objects. */
  readonly prototype: Object;

  /**
   * Returns the prototype of an object.
   * @param o The object that references the prototype.
   */
  getPrototypeOf(o: any): unknown;

  /**
   * Gets the own property descriptor of the specified object.
   * An own property descriptor is one that is defined directly on the object and is not inherited from the object's prototype.
   * @param o Object that contains the property.
   * @param p Name of the property.
   */
  getOwnPropertyDescriptor(
    o: any,
    p: PropertyKey
  ): PropertyDescriptor | undefined;

  /**
   * Returns the names of the own properties of an object. The own properties of an object are those that are defined directly
   * on that object, and are not inherited from the object's prototype. The properties of an object include both fields (objects) and functions.
   * @param o Object that contains the own properties.
   */
  getOwnPropertyNames(o: any): string[];

  /**
   * Creates an object that has the specified prototype or that has null prototype.
   * @param o Object to use as a prototype. May be null.
   */
  create(o: object | null): {};

  /**
   * Creates an object that has the specified prototype, and that optionally contains specified properties.
   * @param o Object to use as a prototype. May be null
   * @param properties JavaScript object that contains one or more property descriptors.
   */
  create<P extends Record<string, PropertyDescriptor>>(
    o: object | null,
    properties: P & ThisType<any>
  ): {
    [K in keyof P]: P[K] extends { value: infer V }
      ? V
      : P[K] extends { get: () => infer V }
      ? V
      : unknown;
  };

  /**
   * Adds a property to an object, or modifies attributes of an existing property.
   * @param o Object on which to add or modify the property. This can be a native JavaScript object (that is, a user-defined object or a built in object) or a DOM object.
   * @param p The property name.
   * @param attributes Descriptor for the property. It can be for a data property or an accessor property.
   */
  defineProperty<O, K extends PropertyKey, D extends PropertyDescriptor>(
    o: O,
    p: K,
    attributes: D & ThisType<any>
  ): O &
    (K extends PropertyKey
      ? Record<
          K,
          D extends { value: infer V }
            ? V
            : D extends { get: () => infer V }
            ? V
            : unknown
        >
      : unknown);

  /**
   * Adds one or more properties to an object, and/or modifies attributes of existing properties.
   * @param o Object on which to add or modify the properties. This can be a native JavaScript object or a DOM object.
   * @param properties JavaScript object that contains one or more descriptor objects. Each descriptor object describes a data property or an accessor property.
   */
  defineProperties<O, P extends Record<PropertyKey, PropertyDescriptor>>(
    o: O,
    properties: P & ThisType<any>
  ): {
    [K in keyof (O & P)]: P[K] extends { value: infer V }
      ? V
      : P[K] extends { get: () => infer V }
      ? V
      : K extends keyof O
      ? O[K]
      : unknown;
  };

  /**
   * Prevents the modification of attributes of existing properties, and prevents the addition of new properties.
   * @param o Object on which to lock the attributes.
   */
  seal<T>(o: T): T;

  /**
   * Prevents the modification of existing property attributes and values, and prevents the addition of new properties.
   * @param o Object on which to lock the attributes.
   */
  freeze<T>(a: T[]): readonly T[];

  /**
   * Prevents the modification of existing property attributes and values, and prevents the addition of new properties.
   * @param o Object on which to lock the attributes.
   */
  freeze<T extends Function>(f: T): T;

  /**
   * Prevents the modification of existing property attributes and values, and prevents the addition of new properties.
   * @param o Object on which to lock the attributes.
   */
  freeze<T>(o: T): Readonly<T>;

  /**
   * Prevents the addition of new properties to an object.
   * @param o Object to make non-extensible.
   */
  preventExtensions<T>(o: T): T;

  /**
   * Returns true if existing property attributes cannot be modified in an object and new properties cannot be added to the object.
   * @param o Object to test.
   */
  isSealed(o: any): boolean;

  /**
   * Returns true if existing property attributes and values cannot be modified in an object, and new properties cannot be added to the object.
   * @param o Object to test.
   */
  isFrozen(o: any): boolean;

  /**
   * Returns a value that indicates whether new properties can be added to an object.
   * @param o Object to test.
   */
  isExtensible(o: any): boolean;

  /**
   * Returns the names of the enumerable string properties and methods of an object.
   * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
   */
  keys(o: object): string[];
}
