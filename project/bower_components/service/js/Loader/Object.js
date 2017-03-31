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
    "js/Arguments",
    "js/Evaluator/Class",
    "js/Exception",
    "js/Promise",
    "js/Sequence",
    "js/Service"
], function (
    util,
    Arguments,
    ClassEvaluator,
    Exception,
    Promise,
    Sequence,
    Service
) {
    "use strict";

    var ARGUMENTS_NAME = "arguments",
        CLASS_PATH_NAME = "class",
        PARAMETERS_NAME = "parameters",
        SERVICES_NAME = "services";

    function ObjectLoader(container, moduleTransport) {
        this.container = container;
        this.moduleTransport = moduleTransport;
    }

    util.extend(ObjectLoader.prototype, {
        load: function (object) {
            var loader = this,
                container = loader.container,
                moduleTransport = loader.moduleTransport,
                parameters = {},
                promise = new Promise(loader),
                serviceNames,
                services;

            util.each(object[PARAMETERS_NAME], function (value, name) {
                parameters[name] = value;
            });

            util.each(parameters, function (value, name) {
                util.each(parameters, function (otherValue, otherName) {
                    if (otherName !== name && typeof otherValue !== "number") {
                        parameters[otherName] = util.string.replace(otherValue, "%" + name + "%", value);
                    }
                });
            });

            util.each(parameters, function (value, name) {
                var match = typeof value !== "number" ? value.match(/%([^%]+)%/) : "";

                if (match) {
                    throw new Exception("ObjectLoader.load() :: Parameter with name '" + name + "' references undefined parameter '" + match[1]);
                }

                container.setParameter(name, value);
            });

            services = {};

            util.each(object[SERVICES_NAME], function (attributes, name) {
                var args = attributes[ARGUMENTS_NAME],
                    classPath = attributes[CLASS_PATH_NAME],
                    values = [];

                if (!classPath) {
                    throw new Exception("ObjectLoader.load() :: Service with name '" + name + "' needs a class attribute");
                }

                util.each(args, function (value, index) {
                    var match = value.match(/^@([^@]+)$/),
                        name;

                    if (match) {
                        name = match[1];

                        if (!services[name]) {
                            services[name] = new Service(name);
                        }

                        values[index] = services[name];
                    } else {
                        match = value.match(/^%([^%]+)%$/);

                        if (match) {
                            name = match[1];
                            values[index] = container.getParameter(name);
                        }
                    }
                });

                if (!services[name]) {
                    services[name] = new Service(name);
                }

                services[name].define(new ClassEvaluator(moduleTransport, classPath, new Arguments(values)));
            });

            util.each(services, function (service) {
                container.define(service);
            });

            return promise;
        }
    });

    return ObjectLoader;
});
