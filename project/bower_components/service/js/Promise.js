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
    "js/util"
], function (
    util
) {
    "use strict";

    var PENDING = 1,
        DONE = 2,
        FAILED = 3,
        DISABLED = 4,
        setTimeout = util.global.setTimeout;

    /**
     * Promise
     *
     * @class js/Promise
     * @param {Object} context
     */
    function Promise(context) {
        this.context = context || util.global;
        this.progressCallbacks = [];
        this.doneCallbacks = [];
        this.failCallbacks = [];

        this.state = PENDING;
        this.finishArgs = null;
        this.notifications = [];
    }

    util.extend(Promise, {
        PENDING: PENDING,
        DONE: DONE,
        FAILED: FAILED,
        DISABLED: DISABLED,

        after: function (promises) {
            var afterPromise = new Promise(),
                pending = 0,
                anyFailed = false;

            function checkPending() {
                if (pending === 0) {
                    if (anyFailed) {
                        afterPromise.reject();
                    } else {
                        afterPromise.resolve();
                    }
                }
            }

            util.each(promises, function (promise) {
                pending += 1;
                promise.fail(function () {
                    anyFailed = true;
                }).always(function () {
                    pending -= 1;

                    checkPending();
                });
            });

            checkPending();

            return afterPromise;
        }
    });

    util.extend(Promise.prototype, {
        /**
         * Adds a callback to be called when the Promise is resolved
         *
         * @method js/Promise#done
         * @param {Function} callback
         * @return {this}
         */
        done: function (callback) {
            // Alternative way of piping
            if (callback instanceof Promise) {
                this.done(function () {
                    callback.resolve.apply(callback, arguments);
                });
            } else if (this.getState() === PENDING || this.getState() === DISABLED) {
                this.doneCallbacks.push(callback);
            } else if (this.getState() === DONE) {
                callback.apply(this.context, this.finishArgs);
            }
            return this;
        },

        /**
         * Adds a callback to be called when the Promise is rejected
         *
         * @method js/Promise#fail
         * @param {Function} callback
         * @return {this}
         */
        fail: function (callback) {
            // Alternative way of piping
            if (callback instanceof Promise) {
                this.fail(function () {
                    callback.reject.apply(callback, arguments);
                });
            } else if (this.getState() === PENDING || this.getState() === DISABLED) {
                this.failCallbacks.push(callback);
            } else if (this.getState() === FAILED) {
                callback.apply(this.context, this.finishArgs);
            }
            return this;
        },

        /**
         * Adds a callback to be called when the promise is either resolved or rejected
         *
         * @method js/Promise#always
         * @param {Function} callback
         * @return {this}
         */
        always: function (callback) {
            this.done(callback);
            this.fail(callback);

            return this;
        },

        /**
         * Adds a callback to be called when the Promise is notified
         *
         * @method js/Promise#listen
         * @param {Function} callback
         * @return {this}
         */
        listen: function (callback) {
            var context = this.context;

            // Alternative way of piping
            if (callback instanceof Promise) {
                this.listen(function () {
                    callback.notify.apply(callback, arguments);
                });
            } else {
                if (this.getState() !== DISABLED) {
                    util.each(this.notifications, function () {
                        callback.apply(context, this);
                    });
                }

                this.progressCallbacks.push(callback);
            }

            return this;
        },

        /**
         * Notifies the Promise by calling any listen callbacks with the given arguments
         *
         * @method js/Promise#notify
         * @return {this}
         */
        notify: function () {
            var notifyArgs = arguments,
                context = this.context;

            if (this.getState() !== PENDING) {
                return this;
            }

            util.each(this.progressCallbacks, function () {
                var callback = this;

                setTimeout(function () {
                    callback.apply(context, notifyArgs);
                });
            });

            this.notifications.push(notifyArgs);

            return this;
        },

        /**
         * Resolves the Promise and calls any done callbacks with the given arguments
         *
         * <p>Promises may only be resolved or rejected once (one-shot) unless {@link js/Promise#reset|.reset()} is called</p>
         *
         * @method js/Promise#resolve
         * @param [args] Optional arguments that are passed to the callbacks
         * @return {this}
         */
        resolve: function () {
            var finishArgs = arguments,
                context = this.context;

            if (this.getState() !== PENDING) {
                return this;
            }

            this.state = DONE;
            this.finishArgs = finishArgs;

            util.each(this.doneCallbacks, function () {
                var callback = this;

                setTimeout(function () {
                    callback.apply(context, finishArgs);
                });
            });

            return this;
        },

        /**
         * Rejects the Promise and calls any fail callbacks with the given arguments
         *
         * <p>Promises may only be resolved or rejected once (one-shot) unless {@link js/Promise#reset|.reset()} is called</p>
         *
         * @method js/Promise#reject
         * @param [args] Optional arguments that are passed to the callbacks
         * @return {this}
         */
        reject: function () {
            var finishArgs = arguments,
                context = this.context;

            if (this.getState() !== PENDING) {
                return this;
            }

            this.state = FAILED;
            this.finishArgs = finishArgs;

            util.each(this.failCallbacks, function () {
                var callback = this;

                setTimeout(function () {
                    callback.apply(context, finishArgs);
                });
            });

            return this;
        },

        /**
         * Route all resolutions/rejections/notifications of this Promise to the specified Promise
         *
         * @method js/Promise#pipe
         * @param {js/Promise} promise
         * @return {this}
         */
        pipe: function (promise) {
            return this
                .listen(function () {
                    promise.notify.apply(promise, arguments);
                })
                .done(function () {
                    promise.resolve.apply(promise, arguments);
                })
                .fail(function () {
                    promise.reject.apply(promise, arguments);
                });
        },

        /**
         * Resets the state of the promise
         *
         * @method js/Promise#reset
         * @return {this}
         */
        reset: function () {
            this.state = PENDING;
            this.finishArgs = null;
            return this;
        },

        /**
         * Disables the promise, preventing it from being resolved, rejected or notified
         *
         * @method js/Promise#disable
         * @return {this}
         */
        disable: function () {
            this.state = DISABLED;
            return this;
        },

        /**
         * Whether the promise is pending and therefore has not yet been resolved or rejected
         *
         * @method js/Promise#isPending
         * @return {Boolean}
         */
        getState: function () {
            return this.state;
        },

        /**
         * Whether the promise is pending and therefore has not yet been resolved or rejected
         *
         * @method js/Promise#isPending
         * @return {Boolean}
         */
        isPending: function () {
            return this.getState() === PENDING;
        },

        /**
         * Whether the promise has been resolved
         *
         * @method js/Promise#isResolved
         * @return {Boolean}
         */
        isResolved: function () {
            return this.getState() === DONE;
        },

        /**
         * Whether the promise has been rejected
         *
         * @method js/Promise#isRejected
         * @return {Boolean}
         */
        isRejected: function () {
            return this.getState() === FAILED;
        },

        /**
         * Whether the promise has been disabled
         *
         * @method js/Promise#isRejected
         * @return {Boolean}
         */
        isDisabled: function () {
            return this.getState() === DISABLED;
        }
    });

    util.extend(Promise.prototype, {
        /**
         * Synonym for done
         *
         * @method js/Promise#then
         * @see js/Promise#done
         */
        then: Promise.prototype.done,
        /**
         * Synonym for fail
         *
         * @method js/Promise#otherwise
         * @see js/Promise#fail
         */
        otherwise: Promise.prototype.fail
    });

    return Promise;
});
