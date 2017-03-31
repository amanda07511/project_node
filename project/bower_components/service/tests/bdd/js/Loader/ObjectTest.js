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
    "vendor/chai/chai",
    "vendor/modular/modular",
    "js/Container",
    "js/Exception",
    "js/Transport/Module",
    "js/Loader/Object"
], function (
    chai,
    modular,
    Container,
    Exception,
    ModuleTransport,
    ObjectLoader
) {
    "use strict";

    var expect = chai.expect;

    describe("ObjectLoader", function () {
        var container,
            loader,
            moduleTransport,
            object,
            objectLoader;

        beforeEach(function (done) {
            modular.require([
                "Modular"
            ], function (
                Modular
            ) {
                container = new Container();
                loader = new Modular();
                moduleTransport = new ModuleTransport(loader);
                objectLoader = new ObjectLoader(container, moduleTransport);
                done();
            });
        });

        describe("when given a simple parameters/services example", function () {
            var CoolLangInterpreter,
                CoolLangVM,
                majorVersion,
                minorVersion,
                revision;

            beforeEach(function () {
                majorVersion = 5;
                minorVersion = 4;
                revision = 7125;

                CoolLangInterpreter = function () {};
                CoolLangVM = function () {};

                loader.define("Interpreter/CoolLang", function () {
                    return CoolLangInterpreter;
                });

                loader.define("VM/CoolLang", function () {
                    return CoolLangVM;
                });

                object = {
                    "parameters": {
                        "majorVersion": majorVersion,
                        "minorVersion": minorVersion,
                        "revision": revision,
                        "version": "%majorVersion%.%minorVersion%.%revision%"
                    },

                    "services": {
                        "interpreter": {
                            "class": "Interpreter/CoolLang"
                        },

                        "vm": {
                            "class": "VM/CoolLang",
                            "arguments": ["@interpreter"]
                        }
                    }
                };

                objectLoader.load(object);
            });

            it("should add the parameter 'majorVersion' to the Container with the correct value", function () {
                expect(container.getParameter("majorVersion")).to.equal(majorVersion);
            });

            it("should add the parameter 'minorVersion' to the Container with the correct value", function () {
                expect(container.getParameter("minorVersion")).to.equal(minorVersion);
            });

            it("should add the parameter 'revision' to the Container with the correct value", function () {
                expect(container.getParameter("revision")).to.equal(revision);
            });

            it("should add the parameter 'version' to the Container with the correct evaluated value", function () {
                expect(container.getParameter("version")).to.equal(majorVersion + "." + minorVersion + "." + revision);
            });

            it("should add the service 'interpreter' to the Container as an instance of the correct class", function (done) {
                container.get("interpreter")
                    .done(function (interpreter) {
                        expect(interpreter).to.be.an.instanceOf(CoolLangInterpreter);
                        done();
                    });
            });
        });

        describe("when given an example with a parameter referencing an undefined parameter name", function () {
            var CoolLangInterpreter,
                CoolLangVM,
                majorVersion,
                minorVersion,
                revision;

            beforeEach(function () {
                majorVersion = 5;
                minorVersion = 4;
                revision = 7125;

                CoolLangInterpreter = function () {};
                CoolLangVM = function () {};

                loader.define("Interpreter/CoolLang", function () {
                    return CoolLangInterpreter;
                });

                loader.define("VM/CoolLang", function () {
                    return CoolLangVM;
                });

                object = {
                    "parameters": {
                        "name": "%noidea%"
                    }
                };
            });

            it("should throw an Exception", function () {
                expect(function () {
                    objectLoader.load(object);
                }).to.throw(Exception);
            });
        });

        describe("when given an example with a parameter referencing an undefined embedded parameter name", function () {
            var CoolLangInterpreter,
                CoolLangVM,
                majorVersion,
                minorVersion,
                revision;

            beforeEach(function () {
                majorVersion = 5;
                minorVersion = 4;
                revision = 7125;

                CoolLangInterpreter = function () {};
                CoolLangVM = function () {};

                loader.define("Interpreter/CoolLang", function () {
                    return CoolLangInterpreter;
                });

                loader.define("VM/CoolLang", function () {
                    return CoolLangVM;
                });

                object = {
                    "parameters": {
                        "name": "all the gear, but %noidea%"
                    }
                };
            });

            it("should throw an Exception", function () {
                expect(function () {
                    objectLoader.load(object);
                }).to.throw(Exception);
            });
        });

        describe("when given an example with a forward-looking service class argument", function () {
            var CoolLangInterpreter,
                CoolLangVM,
                majorVersion,
                minorVersion,
                revision;

            beforeEach(function () {
                majorVersion = 5;
                minorVersion = 4;
                revision = 7125;

                CoolLangInterpreter = function () {};
                CoolLangVM = function () {};

                loader.define("Interpreter/CoolLang", function () {
                    return CoolLangInterpreter;
                });

                loader.define("VM/CoolLang", function () {
                    return CoolLangVM;
                });

                object = {
                    "services": {
                        "vm": {
                            "class": "VM/CoolLang",
                            "arguments": ["@interpreter"]
                        },

                        "interpreter": {
                            "class": "Interpreter/CoolLang"
                        }
                    }
                };

                objectLoader.load(object);
            });

            it("should add the service 'vm' to the Container as an instance of the correct class", function (done) {
                container.get("vm")
                    .done(function (vm) {
                        expect(vm).to.be.an.instanceOf(CoolLangVM);
                        done();
                    });
            });

            it("should add the service 'interpreter' to the Container as an instance of the correct class", function (done) {
                container.get("interpreter")
                    .done(function (interpreter) {
                        expect(interpreter).to.be.an.instanceOf(CoolLangInterpreter);
                        done();
                    });
            });
        });
    });
});
