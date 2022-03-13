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
  entries<T, V = unknown>(
    o: T
  ): (T extends new (...args: any[]) => any
    ? // T is a class constructor
      [string, V]
    : T[keyof T] extends Exclude<T[keyof T], CallableFunction>
    ? string | number extends keyof T
      ? // T is Record<string | number, x>; avoid ([string, x] | [`${number}`, x])[]
        [string, T[string | number]]
      : keyof T extends infer K
      ? K extends keyof T
        ? K extends string | number
          ? [`${K}`, T[K]]
          : never
        : never
      : never
    : // some of T's property is a function, which is not enumerable in many cases
      [string, V])[];
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

