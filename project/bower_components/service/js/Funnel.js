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
define([
    "js/util",
    "./Promise"
], function (
    util,
    Promise
) {
    "use strict";

    var hasOwn = {}.hasOwnProperty;

    /**
     * Funnel
     *
     * @class js/Funnel
     * @augments js/Promise
     * @param {Array} items
     * @param {Function} [callback=function () {}]
     * @param {Object} [context=null]
     */
    function Funnel(items, callback, context) {
        var done = false,
            funnel = this,
            isArray = util.isArray(items),
            key,
            pending = 0,
            promise,
            results = isArray ? [] : {};

        Promise.call(this, context || null);

        callback = callback || function () { return this; };

        for (key in items) {
            if (hasOwn.call(items, key)) {
                promise = callback.call(items[key], items[key], key);

                if (promise && (promise instanceof Promise)) {
                    (function (key) {
                        // Wait for Promise to resolve before marking as done
                        pending += 1;

                        promise
                            .done(function (value) {
                                results[key] = value;
                                pending -= 1;
                                if (pending === 0 && done) {
                                    funnel.resolve(results);
                                }
                            })
                            .fail(function () {
                                funnel.reject();
                            });
                    }(key));
                }
            }
        }

        if (pending === 0) {
            funnel.resolve(results);
        }

        done = true;
    }

    util.inherit(Funnel).from(Promise);

    return Funnel;
});
