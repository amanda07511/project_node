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
    "js/Exception",
    "js/Promise"
], function (
    util,
    Exception,
    Promise
) {
    "use strict";

    function ClassEvaluator(moduleTransport, classPath, args) {
        this.args = args;
        this.classPath = classPath;
        this.moduleTransport = moduleTransport;
    }

    util.extend(ClassEvaluator.prototype, {
        get: function () {
            var evaluator = this,
                args = evaluator.args,
                classPath = evaluator.classPath,
                moduleTransport = evaluator.moduleTransport,
                promise = new Promise(evaluator);

            args.get()
                .done(function (args) {
                    moduleTransport.load(classPath)
                        .done(function (Class) {
                            var object = Object.create(Class.prototype);

                            promise.resolve(Class.apply(object, args) || object);
                        })
                        .fail(function () {
                            promise.reject(new Exception("ObjectLoader.load() :: Class with path '" + classPath + "' failed to load"));
                        });
                })
                .fail(function (exception) {
                    promise.reject(new Exception("ObjectLoader.load() :: Arguments for class with path '" + classPath + "' failed to load", exception));
                });

            return promise;
        }
    });

    return ClassEvaluator;
});
