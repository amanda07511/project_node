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
    "js/Arguments",
    "js/Funnel"
], function (
    chai,
    Arguments,
    Funnel
) {
    "use strict";

    var expect = chai.expect;

    describe("Arguments", function () {
        var args,
            expectedValues,
            values;

        beforeEach(function () {
            args = new Arguments();
        });

        describe("get()", function () {
            it("should return a Funnel", function () {
                expect(args.get()).to.be.an.instanceOf(Funnel);
            });

            describe("when given a list of numbers", function () {
                beforeEach(function () {
                    expectedValues = [7, 4, 2, 3];
                    args = new Arguments(expectedValues);
                });

                it("should resolve the Funnel with an array", function (done) {
                    args.get()
                        .done(function (values) {
                            expect(values).to.be.an("array");
                            done();
                        });
                });

                it("should resolve the Funnel with an array of the values, unaltered", function (done) {
                    args.get()
                        .done(function (values) {
                            expect(values).to.deep.equal(expectedValues);
                            done();
                        });
                });
            });

            describe("when given a list of strings", function () {
                beforeEach(function () {
                    expectedValues = ["oogle", "boogle"];
                    args = new Arguments(expectedValues);
                });

                it("should resolve the Funnel with an array", function (done) {
                    args.get()
                        .done(function (values) {
                            expect(values).to.be.an("array");
                            done();
                        });
                });

                it("should resolve the Funnel with an array of the values, unaltered", function (done) {
                    args.get()
                        .done(function (values) {
                            expect(values).to.deep.equal(expectedValues);
                            done();
                        });
                });
            });
        });
    });
});
