/**
 * ServiceJS library v0.0.1
 * https://github.com/weejot/service.js
 *
 * Copyright 2012 Weejot (weejot.com)
 *
 * Released under the NCSA Open Source license
 * https://github.com/weejot/service.js/raw/master/NCSA-LICENSE.txt
 */

/*global require */
require({
    cache: false,
    paths: {
        "js": "/../../js",
        "bdd": ".",
        "vendor": "/../../vendor"
    }
}, [
    "vendor/chai/chai",
    "vendor/sinon-chai/lib/sinon-chai",
    "require"
], function (
    chai,
    sinonChai,
    require
) {
    "use strict";

    chai.use(sinonChai);

    require([
        "bdd/js/ArgumentsTest",
        "bdd/js/ContainerTest",
        "bdd/js/Loader/ObjectTest"
    ], function () {
        mocha.run();
    });
});
