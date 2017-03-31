/**
 * ServiceJS library v0.0.1
 * https://github.com/weejot/service.js
 *
 * Copyright 2012 Weejot (weejot.com)
 *
 * Released under the NCSA Open Source license
 * https://github.com/weejot/service.js/raw/master/NCSA-LICENSE.txt
 */

/*global define */
define(function () {
    "use strict";

    var global = /*jshint evil: true */new Function("return this;")()/*jshint evil: false */,
        hasOwn = {}.hasOwnProperty,
        slice = [].slice,
        util = {
            each: function (obj, callback, options) {
                var key,
                    length;

                if (!obj) {
                    return;
                }

                options = options || {};

                if (("length" in obj) && !options.keys) {
                    for (key = 0, length = obj.length; key < length; key += 1) { // Keep JSLint happy with '+= 1'
                        if (callback.call(obj[key], obj[key], key, obj) === false) {
                            break;
                        }
                    }
                } else {
                    for (key in obj) {
                        if (hasOwn.call(obj, key)) {
                            if (callback.call(obj[key], obj[key], key, obj) === false) {
                                break;
                            }
                        }
                    }
                }
            },

            extend: function (target) {
                util.each(slice.call(arguments, 1), function (obj) {
                    util.each(obj, function (val, key) {
                        target[key] = val;
                    }, { keys: true });
                });

                return target;
            },

            getType: function (obj) {
                return {}.toString.call(obj).match(/\[object ([\s\S]*)\]/)[1];
            },

            isArray: function (str) {
                return util.getType(str) === "Array";
            },

            isFunction: function (str) {
                return util.getType(str) === "Function";
            },

            isPlainObject: function (obj) {
                return util.getType(obj) === "Object" && typeof obj !== "undefined";
            },

            isString: function (str) {
                return typeof str === "string" || util.getType(str) === "String";
            },

            global: global,

            inherit: function (To) {
                return {
                    from: function (From) {
                        To.prototype = Object.create(From.prototype);
                        To.prototype.constructor = To;
                    }
                };
            },

            regex: {
                escape: function (string) {
                    return string;
                }
            },

            string: {
                replace: function (string, find, replace) {
                    var pattern;

                    find = "" + find;
                    replace = "" + replace;
                    string = "" + string;

                    pattern = new RegExp(util.regex.escape(find), "g");
                    replace = replace.replace(/\$/, "\\$");

                    return string.replace(pattern, replace);
                }
            }
        };

    return util;
});
