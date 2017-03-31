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
    './util',
    './Funnel'
], function (
    util,
    Funnel
) {
    'use strict';

    function get(obj, prop) {
        return obj[prop];
    }

    var UNDEFINED = 1,
        TRANSPORTING = 2,
        DEFINED = 3,
        FILTERING = 4,
        FILTERED = 5,
        DEFERRED = 6,
        LOADING = 7,
        LOADED = 8,
        global = util.global,
        undef;

    function Module(loader, config, id, value) {
        var module = this;

        this.config = {};
        this.dependencies = [];
        this.dependencyIDs = null;
        this.factory = null;
        this.id = id || null;
        this.loader = loader;
        this.mode = value ? LOADED : UNDEFINED;
        this.requesterQueue = [];
        this.whenLoaded = null;
        this.commonJSModule = {
            defer: function () {
                module.mode = DEFERRED;
                return function (value) {
                    module.whenLoaded(value);
                };
            },
            exports: value
        };

        this.extendConfig([config]);
    }

    util.extend(Module.prototype, {
        define: function (config, dependencyIDs, factory) {
            var module = this;

            module.extendConfig([config]);

            module.dependencyIDs = dependencyIDs;
            module.factory = factory;
            module.mode = DEFINED;
        },

        extendConfig: function (sources) {
            var baseID,
                module = this;

            util.extendConfig(module.config, sources);

            // Process relative path mappings - if module ID is null, use base directory
            baseID = (module.id || '').replace(/(^|\/)[^\/]*$/, '$1') || '/';

            if (/^\.\.?\//.test(baseID)) {
                baseID = '/' + baseID;
            }

            util.each(get(module.config, 'paths'), function (path, index, paths) {
                if (/^\.\.?\//.test(path)) {
                    paths[index] = baseID + path;
                }
            });
        },

        getDependencies: function () {
            return this.dependencies;
        },

        getValue: function () {
            var module = this;

            return module.commonJSModule.exports;
        },

        isDeferred: function () {
            return this.mode === DEFERRED;
        },

        isDefined: function () {
            return this.mode >= DEFINED;
        },

        isLoaded: function () {
            return this.mode === LOADED;
        },

        load: function (callback) {
            var loader = this.loader,
                module = this;

            function load(dependencyValues, value, callback) {
                module.mode = LOADED;

                if (!util.isUndefined(value)) {
                    module.commonJSModule.exports = value;
                }

                util.each(module.requesterQueue, function (callback) {
                    callback(module.getValue());
                });
                module.requesterQueue.length = 0;

                if (callback) {
                    callback(module.getValue());
                }
            }

            function getModuleValue(dependencyValues, factory, callback) {
                var value;

                module.whenLoaded = function (value) {
                    module.whenLoaded = null;
                    load(dependencyValues, value, callback);
                };

                value = util.isFunction(factory) ?
                        factory.apply(global, dependencyValues) :
                        factory;

                if (!module.isDeferred() && !module.isLoaded()) {
                    module.whenLoaded = null;
                    load(dependencyValues, value, callback);
                }
            }

            function filter(dependencyValues, callback) {
                var factoryFilter = get(module.config, 'factoryFilter');

                factoryFilter({
                    callback: function (factory) {
                        getModuleValue(dependencyValues, factory, callback);
                    },
                    dependencyValues: dependencyValues,
                    factory: module.factory,
                    id: module.id,
                    loader: loader
                });
            }

            function loadDependencies(callback) {
                var funnel = new Funnel(),
                    dependencyValues = [];

                module.mode = LOADING;

                util.each(module.dependencies, function (dependency, index) {
                    dependency.load(funnel.add(function (value) {
                        // These may load in any order, so don't just .push() them
                        dependencyValues[index] = value;
                    }));
                });

                funnel.done(function () {
                    filter(dependencyValues, callback);
                });
            }

            function resolveDependencies(callback) {
                var idFilter,
                    funnel = new Funnel();

                idFilter = get(module.config, 'idFilter');

                util.extend(module.commonJSModule, {
                    config: module.config,
                    id: module.id,
                    uri: module.id
                });

                util.each(module.dependencyIDs, function (dependencyID, dependencyIndex) {
                    if (!loader.getModule(dependencyID)) {
                        dependencyID = loader.resolveDependencyID(dependencyID, module.id, get(module.config, 'paths'), get(module.config, 'exclude'));
                    }

                    if (dependencyID === 'require') {
                        module.dependencies[dependencyIndex] = new Module(loader, module.config, null, function (arg1, arg2, arg3, arg4) {
                            var args = loader.parseArgs(arg1, arg2, arg3, arg4),
                                config = util.extendConfig({}, [module.config, args.config]);
                            return loader.require(config, args.id || module.id, args.dependencyIDs, args.factory);
                        });
                    } else if (dependencyID === 'exports') {
                        if (util.isUndefined(module.commonJSModule.exports)) {
                            module.commonJSModule.exports = {};
                        }
                        module.dependencies[dependencyIndex] = new Module(loader, module.config, null, module.commonJSModule.exports);
                    } else if (dependencyID === 'module') {
                        if (util.isUndefined(module.commonJSModule.exports)) {
                            module.commonJSModule.exports = {};
                        }
                        module.dependencies[dependencyIndex] = new Module(loader, module.config, null, module.commonJSModule);
                    } else {
                        idFilter(dependencyID, funnel.add(function (dependencyID) {
                            var dependency = loader.getModule(dependencyID);

                            if (dependency) {
                                dependency.extendConfig([module.config]);
                            } else {
                                dependency = loader.createModule(dependencyID, module.config);
                            }

                            module.dependencies[dependencyIndex] = dependency;
                        }));
                    }
                });

                module.mode = FILTERING;

                funnel.done(function () {
                    module.mode = FILTERED;
                    loadDependencies(callback);
                });
            }

            function completeDefine(define) {
                if (!define) {
                    define = {
                        config: {},
                        dependencyIDs: [],
                        factory: undef
                    };
                }

                module.define(define.config, define.dependencyIDs, define.factory);
                resolveDependencies();
            }

            if (module.mode === UNDEFINED) {
                if (callback) {
                    module.requesterQueue.push(callback);
                }
                module.mode = TRANSPORTING;

                loader.parentRequire([module.id], function (module) {
                    completeDefine({
                        config: module.config,
                        dependencyIDs: module.dependencyIDs,
                        factory: module.factory
                    });
                });
            } else if (module.mode === TRANSPORTING || module.mode === LOADING) {
                if (callback) {
                    module.requesterQueue.push(callback);
                }
            } else if (module.mode === DEFINED) {
                resolveDependencies(callback);
            } else if (module.mode === LOADED) {
                if (callback) {
                    callback(module.getValue());
                }
            }
        },

        setParent: function (parent) {
            var module = this;

            module.config = util.extend(parent.config, module.config);
        }
    });

    return Module;
});
