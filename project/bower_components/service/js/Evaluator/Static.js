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
    "js/Promise"
], function (
    util,
    Promise
) {
    "use strict";

    function StaticEvaluator(value) {
        this.value = value;
    }

    util.extend(StaticEvaluator.prototype, {
        get: function (name) {
            return new Promise().resolve(this.value);
        }
    });

    return StaticEvaluator;
});
