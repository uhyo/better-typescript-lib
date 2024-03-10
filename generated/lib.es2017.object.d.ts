/// <reference no-default-lib="true"/>
interface ObjectConstructor {
  /**
   * Returns an array of values of the enumerable properties of an object
   * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
   */
  values<T>(o: ArrayLike<T>): T[];
  /**
   * Returns an array of values of the enumerable properties of an object
   * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
   */
  values<K extends PropertyKey, V>(o: Record<K, V>): V[];
  /**
   * Returns an array of values of the enumerable properties of an object
   * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
   */
  values(o: {}): unknown[];

  /**
   * Returns an array of key/values of the enumerable properties of an object
   * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
   */
  entries<T>(o: ArrayLike<T>): [string, T][];
  /**
   * Returns an array of key/values of the enumerable properties of an object
   * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
   */
  entries<K extends PropertyKey, V>(o: Record<K, V>): [string, V][];
  /**
   * Returns an array of key/values of the enumerable properties of an object
   * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
   */
  entries(o: {}): [string, unknown][];

  /**
   * Returns an object containing all own property descriptors of an object
   * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
   */
  getOwnPropertyDescriptors<T extends {}>(
    o: T,
  ): {
    [P in keyof T]: TypedPropertyDescriptor<T[P]>;
  } & {
    [x: PropertyKey]: PropertyDescriptor;
  };
}
//     /**
//      * Returns an array of values of the enumerable properties of an object
//      * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
//      */
//     values<T>(o: { [s: string]: T; } | ArrayLike<T>): T[];
//     /**
//      * Returns an array of values of the enumerable properties of an object
//      * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
//      */
//     values(o: {}): any[];
//     /**
//      * Returns an array of key/values of the enumerable properties of an object
//      * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
//      */
//     entries<T>(o: { [s: string]: T; } | ArrayLike<T>): [string, T][];
//     /**
//      * Returns an array of key/values of the enumerable properties of an object
//      * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
//      */
//     entries(o: {}): [string, any][];
//     /**
//      * Returns an object containing all own property descriptors of an object
//      * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
//      */
//     getOwnPropertyDescriptors<T>(o: T): { [P in keyof T]: TypedPropertyDescriptor<T[P]>; } & { [x: string]: PropertyDescriptor; };
