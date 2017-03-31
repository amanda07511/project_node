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
define({
    "paths": {
        "js": "./",
        "vendor": "../vendor"
    }
}, [
    "js/ServiceJS"
], function (
    ServiceJS
) {
    "use strict";

    return new ServiceJS();
});
