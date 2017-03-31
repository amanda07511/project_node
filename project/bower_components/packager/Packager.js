/*
 * Packager - AMD package plugin
 * Copyright 2014 Dan Phillimore (asmblah)
 * http://asmblah.github.com/packager/
 *
 * Released under the MIT license
 * https://github.com/asmblah/packager/raw/master/MIT-LICENSE.txt
 */

/*global define, require */
define([
    './js/util',
    './js/Packager'
], function (
    util,
    Packager
) {
    'use strict';

    var packager = new Packager(define, require);

    packager.hook();

    return {
        load: function (name, req, onLoad) {
            packager.require([name], function (value) {
                if (packager.isModule(value)) {
                    value.load(onLoad);
                } else {
                    onLoad(value);
                }
            });
        }
    };
});
