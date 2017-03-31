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
    "js/Promise",
    "js/Exception"
], function (
    util,
    Promise,
    Exception
) {
    "use strict";

    function doSequence(sequence, list, callback, i) {
        var length = list.length,
            item,
            promise;

        if (typeof length === "undefined") {
            throw new Exception("Sequence doSequence() :: 'list' must have a length property");
        }

        for (i = i || 0; i < length; i += 1) {
            item = list[i];
            promise = callback.call(item, item);

            if (promise && (promise instanceof Promise)) {
                // Callback has returned a Promise, so pause iteration now & resume when resolved
                promise
                    .done(function () {
                        doSequence(sequence, list, callback, i + 1);
                    })
                    .fail(function (error) {
                        sequence.reject(error);
                    });
                return;
            }
        }

        // Finished processing all items in list
        sequence.resolve();
    }

    /**
     * Sequence
     *
     * @class js/Sequence
     * @param {Object} context
     * @param {Array} list
     * @param {Function} [callback]
     */
    function Sequence(context, list, callback) {
        Promise.call(this, context);

        callback = callback || function () {
            return this;
        };

        doSequence(this, list || [], callback, 0);
    }

    util.inherit(Sequence).from(Promise);

    return Sequence;
});
