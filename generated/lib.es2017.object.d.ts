/// <reference no-default-lib="true"/>

interface ObjectConstructor {
  /**
   * Returns an array of values of the enumerable properties of an object
   * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
   */
  values<T>(o: ArrayLike<T>): T[];
  values<K extends string | number | symbol, V>(o: Record<K, V>): V[];
  values(o: unknown): unknown[];

  /**
   * Returns an array of key/values of the enumerable properties of an object
   * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
   */
  entries<T>(o: ArrayLike<T>): [string, T][];
  entries<K extends string | number | symbol, V>(o: Record<K, V>): [string, V][];
  entries<T>(o: T): [string, unknown][];

  /**
   * Returns an object containing all own property descriptors of an object
   * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
   */
  getOwnPropertyDescriptors<T>(
    o: T
  ): { [P in keyof T]: TypedPropertyDescriptor<T[P]> } & {
    [x: string]: PropertyDescriptor;
  };
}
// --------------------

// interface ObjectConstructor {
//     /**
//      * Returns an array of values of the enumerable properties of an object
//      * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
//      */
//     values<T>(o: { [s: string]: T } | ArrayLike<T>): T[];
// 
//     /**
//      * Returns an array of values of the enumerable properties of an object
//      * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
//      */
//     values(o: {}): any[];
// 
//     /**
//      * Returns an array of key/values of the enumerable properties of an object
//      * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
//      */
//     entries<T>(o: { [s: string]: T } | ArrayLike<T>): [string, T][];
// 
//     /**
//      * Returns an array of key/values of the enumerable properties of an object
//      * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
//      */
//     entries(o: {}): [string, any][];
// 
//     /**
//      * Returns an object containing all own property descriptors of an object
//      * @param o Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
//      */
//     getOwnPropertyDescriptors<T>(o: T): {[P in keyof T]: TypedPropertyDescriptor<T[P]>} & { [x: string]: PropertyDescriptor };
// }

