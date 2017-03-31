/*
 * Packager - AMD package plugin
 * Copyright 2014 Dan Phillimore (asmblah)
 * http://asmblah.github.com/packager/
 *
 * Released under the MIT license
 * https://github.com/asmblah/packager/raw/master/MIT-LICENSE.txt
 */

/*global define */
define([
    './util'
], function (
    util
) {
    'use strict';

    function Funnel() {
        this.doneCallbacks = [];
        this.pending = 0;
    }

    util.extend(Funnel.prototype, {
        add: function (callback) {
            var funnel = this;

            funnel.pending += 1;

            return function (arg1, arg2, arg3, arg4) {
                var result = callback.call(this, arg1, arg2, arg3, arg4);

                funnel.pending -= 1;
                if (funnel.pending === 0) {
                    util.each(funnel.doneCallbacks, function (callback) {
                        callback();
                    });
                }

                return result;
            };
        },

        done: function (callback) {
            if (this.pending === 0) {
                callback();
            } else {
                this.doneCallbacks.push(callback);
            }
        }
    });

    return Funnel;
});
