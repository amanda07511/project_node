/*
 * Packager - AMD package plugin
 * Copyright 2014 Dan Phillimore (asmblah)
 * http://asmblah.github.com/packager/
 *
 * Released under the MIT license
 * https://github.com/asmblah/packager/raw/master/MIT-LICENSE.txt
 */

/*global define:true, require:true */
define([
    './util',
    './Module'
], function (
    util,
    Module
) {
    'use strict';

    var undef;

    function Packager(define, require) {
        this.config = {
            'exclude': /(?!)/,
            'factoryFilter': function (args) {
                args.callback(args.factory);
            },
            'idFilter': function (id, callback) {
                callback(id);
            }
        };
        this.modules = {};
        this.parentDefine = define;
        this.parentRequire = require;

        // Expose Packager class itself to dependents
        this.define('Packager', function () {
            return Packager;
        });

        // Expose this instance of Packager to its dependents
        this.define('packager', this);
    }

    util.extend(Packager.prototype, {
        configure: function (config) {
            if (config) {
                util.extendConfig(this.config, [config]);
            } else {
                return this.config;
            }
        },

        createDefiner: function () {
            var packager = this;

            function define(arg1, arg2, arg3, arg4) {
                return packager.define(arg1, arg2, arg3, arg4);
            }

            define.amd = packager.parentDefine.amd;

            return define;
        },

        createModule: function (id, config) {
            var module = new Module(this, config, id);

            this.modules[id] = module;

            return module;
        },

        createRequirer: function () {
            var packager = this;

            function require(arg1, arg2, arg3, arg4) {
                return packager.require(arg1, arg2, arg3, arg4);
            }

            util.extend(require, {
                config: function (config) {
                    return packager.configure(config);
                }
            });

            return require;
        },

        define: function (arg1, arg2, arg3, arg4) {
            var packager = this,
                args = this.parseArgs(arg1, arg2, arg3, arg4),
                config = util.extendConfig({}, [this.config, args.config]),
                id = args.id,
                module;

            if (id === null) {
                this.parentDefine([
                    'module'
                ], function (
                    loaderModule
                ) {
                    module = packager.getModule(loaderModule.id);
                    if (module) {
                        if (module.isDefined()) {
                            throw new Error('Module "' + loaderModule.id + '" has already been defined');
                        }
                    } else {
                        module = packager.createModule(loaderModule.id, config);
                    }

                    module.define(args.config, args.dependencyIDs, args.factory);

                    return module;
                });
            } else {
                module = this.getModule(id);
                if (module) {
                    if (module.isDefined()) {
                        throw new Error('Module "' + id + '" has already been defined');
                    }
                } else {
                    module = this.createModule(id, util.extendConfig({}, [this.config, args.config]));
                }

                module.define(args.config, args.dependencyIDs, args.factory);

                this.parentDefine(id, module);
            }
        },

        getModule: function (id) {
            return this.modules[id];
        },

        hook: function () {
            var packager = this;

            define = packager.createDefiner();
            require = packager.createRequirer();
        },

        isModule: function (value) {
            return value instanceof Module;
        },

        parseArgs: function (arg1, arg2, arg3, arg4) {
            var config = null,
                id = null,
                dependencyIDs = null,
                factory = undef;

            if (util.isPlainObject(arg1)) {
                config = arg1;
            } else if (util.isString(arg1)) {
                id = arg1;
            } else if (util.isArray(arg1)) {
                dependencyIDs = arg1;
            } else if (util.isFunction(arg1)) {
                factory = arg1;
            }

            if (util.isString(arg2)) {
                id = arg2;
            } else if (util.isArray(arg2)) {
                dependencyIDs = arg2;
            } else if (util.isFunction(arg2) || util.isPlainObject(arg2)) {
                factory = arg2;
            }

            if (util.isArray(arg3)) {
                dependencyIDs = arg3;
            } else if (util.isFunction(arg3) || util.isPlainObject(arg3)) {
                factory = arg3;
            }

            if (util.isFunction(arg4)) {
                factory = arg4;
            }

            // Special case: only an object passed - use as factory
            if (config && !id && !dependencyIDs && !factory) {
                factory = config;
                config = null;
            }

            // Special case: only an array passed - use as factory
            if (!config && dependencyIDs && !id && !factory) {
                factory = dependencyIDs;
                dependencyIDs = null;
            }

            return {
                config: config || {},
                id: id,
                dependencyIDs: dependencyIDs || [],
                factory: factory
            };
        },

        resolveDependencyID: function (id, dependentID, mappings, exclude) {
            var previousID;

            if (!util.isString(id)) {
                throw new Error('Invalid dependency id');
            }

            if (exclude && exclude.test(id)) {
                return id;
            }

            if (/^\.\.?\//.test(id) && dependentID) {
                id = dependentID.replace(/[^\/]+$/, '') + id;
            } else {
                id = id.replace(/^\//, '');

                if (mappings && !/^\.\.?\//.test(id)) {
                    id = (function () {
                        var terms = id.split('/'),
                            portion,
                            index;

                        function getMapping(id) {
                            return mappings[id] || mappings['/' + id];
                        }

                        if (getMapping(id)) {
                            return getMapping(id);
                        }

                        for (index = terms.length - 1; index >= 0; index -= 1) {
                            portion = terms.slice(0, index).join('/');
                            if (getMapping(portion) || getMapping(portion + '/')) {
                                return (getMapping(portion) || getMapping(portion + '/')).replace(/\/$/, '') + '/' + terms.slice(index).join('/');
                            }
                        }
                        return id;
                    }());
                }
            }

            id = id.replace(/^\//, '');

            // Resolve parent-directory terms in id
            while (previousID !== id) {
                previousID = id;
                id = id.replace(/(\/|^)(?!\.\.)[^\/]*\/\.\.\//, '$1');
            }

            id = id.replace(/(^|\/)(\.?\/)+/g, '$1'); // Resolve same-directory terms

            return id;
        },

        'require': function (arg1, arg2, arg3, arg4) {
            var args = this.parseArgs(arg1, arg2, arg3, arg4),
                id = args.id,
                module;

            if (args.id && args.dependencyIDs.length === 0 && !args.factory) {
                module = this.getModule(args.id);

                if (!module || (!module.isLoaded() && module.getDependencies().length > 0)) {
                    throw new Error('Module "' + args.id + '" has not yet loaded');
                }

                module.load();

                return module.getValue();
            } else {
                module = new Module(this, this.config, id);

                module.define(args.config, args.dependencyIDs, args.factory);
                module.load();
            }
        },

        util: util
    });

    return Packager;
});
