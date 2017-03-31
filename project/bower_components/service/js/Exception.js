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
    "js/util"
], function (
    util
) {
    "use strict";

    function Exception(message, parent) {
        this.message = message;
        this.parent = parent;
    }

    util.inherit(Exception).from(Error);

    util.extend(Exception.prototype, {
        getMessage: function () {
            var exception = this,
                message = this.message,
                parent = this.parent;

            if (parent) {
                message += " << " + (parent instanceof Exception ? parent.getMessage() : parent.toString());
            }

            return message;
        },

        name: "Exception"
    });

    return Exception;
});
