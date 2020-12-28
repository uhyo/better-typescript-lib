"use strict";
/// <reference path="../dist/lib/lib.es5.d.ts" />
exports.__esModule = true;
// eval
// $ExpectType unknown
eval("foo");
// Object
// $ExpectType {}
Object();
// $ExpectType { foo: number; bar: 123 }
Object({ foo: 123 });
// $ExpctType {}
Object(123);
// $ExpctType unknown
Object.getPrototypeOf([]);
// Object.create
// $ExpectType {}
Object.create(null);
// $ExpectType { foo: number; bar: string }
Object.create(null, {
    foo: {
        value: 123
    },
    bar: {
        get: function () {
            return "hi";
        }
    }
});
// Object.defineProperty
// $ExpectType { foo: number }
Object.defineProperty({}, "foo", {
    value: 123
});
// $ExpectType { foo: number } | { bar: number }
Object.defineProperty({}, "foo", {
    value: 123
});
// $ExpectType { foo: number; bar: string; baz: boolean }
Object.defineProperties({ foo: 123 }, {
    bar: {
        value: 123
    },
    baz: {
        get: function () {
            return true;
        }
    }
});
