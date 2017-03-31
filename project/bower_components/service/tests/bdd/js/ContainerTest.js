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
    "js/Container",
    "js/Exception"
], function (
    chai,
    Container,
    Exception
) {
    "use strict";

    var expect = chai.expect;

    describe("Container", function () {
        var container,
            expectedService,
            name,
            parameter,
            service;

        beforeEach(function () {
            container = new Container();
        });

        describe("get()", function () {
            describe("when name is 'parser'", function () {
                beforeEach(function () {
                    name = "parser";
                });

                it("should return the specified service when it exists", function (done) {
                    expectedService = {};
                    container.set(name, expectedService);

                    container.get(name)
                        .done(function (service) {
                            expect(service).to.equal(expectedService);
                            done();
                        });
                });

                it("should throw an Exception when the specified service does not exist", function () {
                    expect(function () {
                        container.get(name);
                    }).to.throw(Exception);
                });
            });

            describe("when two names are specified, 'parser' and 'interpreter'", function () {
                var name1,
                    name2;

                beforeEach(function () {
                    name1 = "parser";
                    name2 = "interpreter";
                });

                it("should return the specified first service when both exist", function (done) {
                    expectedService = {};
                    container.set(name1, expectedService);
                    container.set(name2, {});

                    container.get(name1, name2)
                        .done(function (service1, service2) {
                            expect(service1).to.equal(expectedService);
                            done();
                        });
                });

                it("should return the specified second service when both exist", function (done) {
                    expectedService = {};
                    container.set(name1, {});
                    container.set(name2, expectedService);

                    container.get(name1, name2)
                        .done(function (service1, service2) {
                            expect(service2).to.equal(expectedService);
                            done();
                        });
                });
            });
        });

        describe("getParameter()", function () {
            describe("when name is 'version'", function () {
                beforeEach(function () {
                    name = "version";
                });

                it("should return the specified parameter when it exists", function () {
                    parameter = "3.1.459";
                    container.setParameter(name, parameter);

                    expect(container.getParameter(name)).to.equal(parameter);
                });

                it("should throw an Exception when the specified parameter does not exist", function () {
                    expect(function () {
                        container.getParameter(name);
                    }).to.throw(Exception);
                });
            });
        });

        describe("set()", function () {
            describe("when name is 'stabilizer'", function () {
                beforeEach(function () {
                    name = "stabilizer";
                });

                describe("when the specified service does not exist yet", function () {
                    it("should not throw an Exception", function () {
                        service = {};

                        expect(function () {
                            container.set(name, service);
                        }).to.not.throw(Exception);
                    });

                    it("should store the specified service when it does not exist yet", function (done) {
                        expectedService = {};

                        container.set(name, expectedService);

                        container.get(name)
                            .done(function (service) {
                                expect(service).to.equal(expectedService);
                                done();
                            });
                    });
                });

                describe("when the specified service already exists", function () {
                    it("should throw an Exception", function () {
                        service = {};
                        container.set(name, service);

                        expect(function () {
                            service = {};
                            container.set(name, service);
                        }).to.throw(Exception);
                    });
                });
            });
        });

        describe("setParameter()", function () {
            describe("when name is 'rootDomain'", function () {
                beforeEach(function () {
                    name = "rootDomain";
                });

                describe("when the specified parameter does not exist yet", function () {
                    it("should store the specified parameter", function () {
                        parameter = "arggh-age";

                        container.setParameter(name, parameter);

                        expect(container.getParameter(name)).to.equal(parameter);
                    });
                });

                describe("when the specified parameter already exists", function () {
                    it("should not throw an Exception", function () {
                        parameter = "oogalboogal";

                        container.setParameter(name, parameter);

                        expect(function () {
                            parameter = "oojimaflip";

                            container.setParameter(name, parameter);
                        }).to.not.throw(Exception);
                    });
                });
            });
        });
    });
});
