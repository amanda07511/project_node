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
    "js/Funnel",
    "js/Promise",
    "js/Service"
], function (
    util,
    Funnel,
    Promise,
    Service
) {
    "use strict";

    function Arguments(values) {
        this.values = values;
    }

    util.extend(Arguments.prototype, {
        get: function () {
            var args = this,
                values = args.values;

            return new Funnel(values, function (value) {
                if (value && (value instanceof Service)) {
                    return value.get();
                }

                return new Promise().resolve(value);
            }, args);
        }
    });

    return Arguments;
});
