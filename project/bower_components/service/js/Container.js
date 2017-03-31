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
    "js/Funnel",
    "js/Promise",
    "js/Service",
    "js/Evaluator/Static"
], function (
    util,
    Exception,
    Funnel,
    Promise,
    Service,
    StaticEvaluator
) {
    "use strict";

    var hasOwn = {}.hasOwnProperty;

    function Container() {
        this.parameters = {};
        this.services = {};
    }

    util.extend(Container.prototype, {
        define: function (service) {
            this.services[service.getName()] = service;
        },

        get: function (/* name1, name2, ... */) {
            var servicePromises = [],
                names = arguments,
                promise = new Promise(),
                services = this.services;

            util.each(names, function (name) {
                if (!hasOwn.call(services, name)) {
                    throw new Exception("Container.get() :: Service with name '" + name + "' not found");
                }

                servicePromises.push(services[name].get());
            });

            new Funnel(servicePromises)
                .done(function (services) {
                    promise.resolve.apply(promise, services);
                })
                .fail(promise);

            return promise;
        },

        getParameter: function (name) {
            if (!hasOwn.call(this.parameters, name)) {
                throw new Exception("Container.getParameter() :: Parameter with name '" + name + "' not found");
            }

            return this.parameters[name];
        },

        set: function (name, value) {
            if (hasOwn.call(this.services, name)) {
                throw new Exception("Container.set() :: Service already defined with name '" + name + "'");
            }

            this.services[name] = new Service(name);
            this.services[name].define(new StaticEvaluator(value));
        },

        setParameter: function (name, value) {
            this.parameters[name] = value;
        }
    });

    return Container;
});
