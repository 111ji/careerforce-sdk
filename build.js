"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (f) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }g.cfsdk = f();
  }
})(function () {
  var define, module, exports;return function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
        }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
          var n = t[o][1][e];return s(n ? n : e);
        }, l, l.exports, e, t, n, r);
      }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
      s(r[o]);
    }return s;
  }({ 1: [function (require, module, exports) {
      // shim for using process in browser
      var process = module.exports = {};

      // cached from whatever global is present so that test runners that stub it
      // don't break things.  But we need to wrap it in a try catch in case it is
      // wrapped in strict mode code which doesn't define any globals.  It's inside a
      // function because try/catches deoptimize in certain engines.

      var cachedSetTimeout;
      var cachedClearTimeout;

      function defaultSetTimout() {
        throw new Error('setTimeout has not been defined');
      }
      function defaultClearTimeout() {
        throw new Error('clearTimeout has not been defined');
      }
      (function () {
        try {
          if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
          } else {
            cachedSetTimeout = defaultSetTimout;
          }
        } catch (e) {
          cachedSetTimeout = defaultSetTimout;
        }
        try {
          if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
          } else {
            cachedClearTimeout = defaultClearTimeout;
          }
        } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
        }
      })();
      function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
          //normal enviroments in sane situations
          return setTimeout(fun, 0);
        }
        // if setTimeout wasn't available but was latter defined
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
        }
        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0);
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
          }
        }
      }
      function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
          //normal enviroments in sane situations
          return clearTimeout(marker);
        }
        // if clearTimeout wasn't available but was latter defined
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
        }
        try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker);
        } catch (e) {
          try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
          } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
          }
        }
      }
      var queue = [];
      var draining = false;
      var currentQueue;
      var queueIndex = -1;

      function cleanUpNextTick() {
        if (!draining || !currentQueue) {
          return;
        }
        draining = false;
        if (currentQueue.length) {
          queue = currentQueue.concat(queue);
        } else {
          queueIndex = -1;
        }
        if (queue.length) {
          drainQueue();
        }
      }

      function drainQueue() {
        if (draining) {
          return;
        }
        var timeout = runTimeout(cleanUpNextTick);
        draining = true;

        var len = queue.length;
        while (len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
            if (currentQueue) {
              currentQueue[queueIndex].run();
            }
          }
          queueIndex = -1;
          len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
      }

      process.nextTick = function (fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
          }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
        }
      };

      // v8 likes predictible objects
      function Item(fun, array) {
        this.fun = fun;
        this.array = array;
      }
      Item.prototype.run = function () {
        this.fun.apply(null, this.array);
      };
      process.title = 'browser';
      process.browser = true;
      process.env = {};
      process.argv = [];
      process.version = ''; // empty string to avoid regexp issues
      process.versions = {};

      function noop() {}

      process.on = noop;
      process.addListener = noop;
      process.once = noop;
      process.off = noop;
      process.removeListener = noop;
      process.removeAllListeners = noop;
      process.emit = noop;
      process.prependListener = noop;
      process.prependOnceListener = noop;

      process.listeners = function (name) {
        return [];
      };

      process.binding = function (name) {
        throw new Error('process.binding is not supported');
      };

      process.cwd = function () {
        return '/';
      };
      process.chdir = function (dir) {
        throw new Error('process.chdir is not supported');
      };
      process.umask = function () {
        return 0;
      };
    }, {}], 2: [function (require, module, exports) {
      var HttpUtil = require('./src/http_client.js');
      var STS = require('./src/sts.js');
      var WXLOGIN = require('./src/wxlogin');
      var wx_share = require('./src/wx_share_config');
      var httpUtil = new HttpUtil();
      var sts = new STS();
      var wx_share = new wx_share();
      sts.setHttpClient(httpUtil);

      exports.httpUtil = httpUtil;
      exports.sts = sts;
      exports.WXLOGIN = WXLOGIN;
      exports.wx_share = wx_share;
    }, { "./src/http_client.js": 34, "./src/sts.js": 35, "./src/wx_share_config": 36, "./src/wxlogin": 37 }], 3: [function (require, module, exports) {
      module.exports = require('./lib/axios');
    }, { "./lib/axios": 5 }], 4: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var utils = require('./../utils');
        var settle = require('./../core/settle');
        var buildURL = require('./../helpers/buildURL');
        var parseHeaders = require('./../helpers/parseHeaders');
        var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
        var createError = require('../core/createError');
        var btoa = typeof window !== 'undefined' && window.btoa && window.btoa.bind(window) || require('./../helpers/btoa');

        module.exports = function xhrAdapter(config) {
          return new Promise(function dispatchXhrRequest(resolve, reject) {
            var requestData = config.data;
            var requestHeaders = config.headers;

            if (utils.isFormData(requestData)) {
              delete requestHeaders['Content-Type']; // Let the browser set it
            }

            var request = new XMLHttpRequest();
            var loadEvent = 'onreadystatechange';
            var xDomain = false;

            // For IE 8/9 CORS support
            // Only supports POST and GET calls and doesn't returns the response headers.
            // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
            if (process.env.NODE_ENV !== 'test' && typeof window !== 'undefined' && window.XDomainRequest && !('withCredentials' in request) && !isURLSameOrigin(config.url)) {
              request = new window.XDomainRequest();
              loadEvent = 'onload';
              xDomain = true;
              request.onprogress = function handleProgress() {};
              request.ontimeout = function handleTimeout() {};
            }

            // HTTP basic authentication
            if (config.auth) {
              var username = config.auth.username || '';
              var password = config.auth.password || '';
              requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
            }

            request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

            // Set the request timeout in MS
            request.timeout = config.timeout;

            // Listen for ready state
            request[loadEvent] = function handleLoad() {
              if (!request || request.readyState !== 4 && !xDomain) {
                return;
              }

              // The request errored out and we didn't get a response, this will be
              // handled by onerror instead
              // With one exception: request that using file: protocol, most browsers
              // will return status as 0 even though it's a successful request
              if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
                return;
              }

              // Prepare the response
              var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
              var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
              var response = {
                data: responseData,
                // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
                status: request.status === 1223 ? 204 : request.status,
                statusText: request.status === 1223 ? 'No Content' : request.statusText,
                headers: responseHeaders,
                config: config,
                request: request
              };

              settle(resolve, reject, response);

              // Clean up request
              request = null;
            };

            // Handle low level network errors
            request.onerror = function handleError() {
              // Real errors are hidden from us by the browser
              // onerror should only fire if it's a network error
              reject(createError('Network Error', config, null, request));

              // Clean up request
              request = null;
            };

            // Handle timeout
            request.ontimeout = function handleTimeout() {
              reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', request));

              // Clean up request
              request = null;
            };

            // Add xsrf header
            // This is only done if running in a standard browser environment.
            // Specifically not if we're in a web worker, or react-native.
            if (utils.isStandardBrowserEnv()) {
              var cookies = require('./../helpers/cookies');

              // Add xsrf header
              var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : undefined;

              if (xsrfValue) {
                requestHeaders[config.xsrfHeaderName] = xsrfValue;
              }
            }

            // Add headers to the request
            if ('setRequestHeader' in request) {
              utils.forEach(requestHeaders, function setRequestHeader(val, key) {
                if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
                  // Remove Content-Type if data is undefined
                  delete requestHeaders[key];
                } else {
                  // Otherwise add header to the request
                  request.setRequestHeader(key, val);
                }
              });
            }

            // Add withCredentials to request if needed
            if (config.withCredentials) {
              request.withCredentials = true;
            }

            // Add responseType to request if needed
            if (config.responseType) {
              try {
                request.responseType = config.responseType;
              } catch (e) {
                // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
                // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
                if (config.responseType !== 'json') {
                  throw e;
                }
              }
            }

            // Handle progress if needed
            if (typeof config.onDownloadProgress === 'function') {
              request.addEventListener('progress', config.onDownloadProgress);
            }

            // Not all browsers support upload events
            if (typeof config.onUploadProgress === 'function' && request.upload) {
              request.upload.addEventListener('progress', config.onUploadProgress);
            }

            if (config.cancelToken) {
              // Handle cancellation
              config.cancelToken.promise.then(function onCanceled(cancel) {
                if (!request) {
                  return;
                }

                request.abort();
                reject(cancel);
                // Clean up request
                request = null;
              });
            }

            if (requestData === undefined) {
              requestData = null;
            }

            // Send the request
            request.send(requestData);
          });
        };
      }).call(this, require('_process'));
    }, { "../core/createError": 11, "./../core/settle": 14, "./../helpers/btoa": 18, "./../helpers/buildURL": 19, "./../helpers/cookies": 21, "./../helpers/isURLSameOrigin": 23, "./../helpers/parseHeaders": 25, "./../utils": 27, "_process": 1 }], 5: [function (require, module, exports) {
      'use strict';

      var utils = require('./utils');
      var bind = require('./helpers/bind');
      var Axios = require('./core/Axios');
      var defaults = require('./defaults');

      /**
       * Create an instance of Axios
       *
       * @param {Object} defaultConfig The default config for the instance
       * @return {Axios} A new instance of Axios
       */
      function createInstance(defaultConfig) {
        var context = new Axios(defaultConfig);
        var instance = bind(Axios.prototype.request, context);

        // Copy axios.prototype to instance
        utils.extend(instance, Axios.prototype, context);

        // Copy context to instance
        utils.extend(instance, context);

        return instance;
      }

      // Create the default instance to be exported
      var axios = createInstance(defaults);

      // Expose Axios class to allow class inheritance
      axios.Axios = Axios;

      // Factory for creating new instances
      axios.create = function create(instanceConfig) {
        return createInstance(utils.merge(defaults, instanceConfig));
      };

      // Expose Cancel & CancelToken
      axios.Cancel = require('./cancel/Cancel');
      axios.CancelToken = require('./cancel/CancelToken');
      axios.isCancel = require('./cancel/isCancel');

      // Expose all/spread
      axios.all = function all(promises) {
        return Promise.all(promises);
      };
      axios.spread = require('./helpers/spread');

      module.exports = axios;

      // Allow use of default import syntax in TypeScript
      module.exports.default = axios;
    }, { "./cancel/Cancel": 6, "./cancel/CancelToken": 7, "./cancel/isCancel": 8, "./core/Axios": 9, "./defaults": 16, "./helpers/bind": 17, "./helpers/spread": 26, "./utils": 27 }], 6: [function (require, module, exports) {
      'use strict';

      /**
       * A `Cancel` is an object that is thrown when an operation is canceled.
       *
       * @class
       * @param {string=} message The message.
       */

      function Cancel(message) {
        this.message = message;
      }

      Cancel.prototype.toString = function toString() {
        return 'Cancel' + (this.message ? ': ' + this.message : '');
      };

      Cancel.prototype.__CANCEL__ = true;

      module.exports = Cancel;
    }, {}], 7: [function (require, module, exports) {
      'use strict';

      var Cancel = require('./Cancel');

      /**
       * A `CancelToken` is an object that can be used to request cancellation of an operation.
       *
       * @class
       * @param {Function} executor The executor function.
       */
      function CancelToken(executor) {
        if (typeof executor !== 'function') {
          throw new TypeError('executor must be a function.');
        }

        var resolvePromise;
        this.promise = new Promise(function promiseExecutor(resolve) {
          resolvePromise = resolve;
        });

        var token = this;
        executor(function cancel(message) {
          if (token.reason) {
            // Cancellation has already been requested
            return;
          }

          token.reason = new Cancel(message);
          resolvePromise(token.reason);
        });
      }

      /**
       * Throws a `Cancel` if cancellation has been requested.
       */
      CancelToken.prototype.throwIfRequested = function throwIfRequested() {
        if (this.reason) {
          throw this.reason;
        }
      };

      /**
       * Returns an object that contains a new `CancelToken` and a function that, when called,
       * cancels the `CancelToken`.
       */
      CancelToken.source = function source() {
        var cancel;
        var token = new CancelToken(function executor(c) {
          cancel = c;
        });
        return {
          token: token,
          cancel: cancel
        };
      };

      module.exports = CancelToken;
    }, { "./Cancel": 6 }], 8: [function (require, module, exports) {
      'use strict';

      module.exports = function isCancel(value) {
        return !!(value && value.__CANCEL__);
      };
    }, {}], 9: [function (require, module, exports) {
      'use strict';

      var defaults = require('./../defaults');
      var utils = require('./../utils');
      var InterceptorManager = require('./InterceptorManager');
      var dispatchRequest = require('./dispatchRequest');
      var isAbsoluteURL = require('./../helpers/isAbsoluteURL');
      var combineURLs = require('./../helpers/combineURLs');

      /**
       * Create a new instance of Axios
       *
       * @param {Object} instanceConfig The default config for the instance
       */
      function Axios(instanceConfig) {
        this.defaults = instanceConfig;
        this.interceptors = {
          request: new InterceptorManager(),
          response: new InterceptorManager()
        };
      }

      /**
       * Dispatch a request
       *
       * @param {Object} config The config specific for this request (merged with this.defaults)
       */
      Axios.prototype.request = function request(config) {
        /*eslint no-param-reassign:0*/
        // Allow for axios('example/url'[, config]) a la fetch API
        if (typeof config === 'string') {
          config = utils.merge({
            url: arguments[0]
          }, arguments[1]);
        }

        config = utils.merge(defaults, this.defaults, { method: 'get' }, config);
        config.method = config.method.toLowerCase();

        // Support baseURL config
        if (config.baseURL && !isAbsoluteURL(config.url)) {
          config.url = combineURLs(config.baseURL, config.url);
        }

        // Hook up interceptors middleware
        var chain = [dispatchRequest, undefined];
        var promise = Promise.resolve(config);

        this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
          chain.unshift(interceptor.fulfilled, interceptor.rejected);
        });

        this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
          chain.push(interceptor.fulfilled, interceptor.rejected);
        });

        while (chain.length) {
          promise = promise.then(chain.shift(), chain.shift());
        }

        return promise;
      };

      // Provide aliases for supported request methods
      utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
        /*eslint func-names:0*/
        Axios.prototype[method] = function (url, config) {
          return this.request(utils.merge(config || {}, {
            method: method,
            url: url
          }));
        };
      });

      utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
        /*eslint func-names:0*/
        Axios.prototype[method] = function (url, data, config) {
          return this.request(utils.merge(config || {}, {
            method: method,
            url: url,
            data: data
          }));
        };
      });

      module.exports = Axios;
    }, { "./../defaults": 16, "./../helpers/combineURLs": 20, "./../helpers/isAbsoluteURL": 22, "./../utils": 27, "./InterceptorManager": 10, "./dispatchRequest": 12 }], 10: [function (require, module, exports) {
      'use strict';

      var utils = require('./../utils');

      function InterceptorManager() {
        this.handlers = [];
      }

      /**
       * Add a new interceptor to the stack
       *
       * @param {Function} fulfilled The function to handle `then` for a `Promise`
       * @param {Function} rejected The function to handle `reject` for a `Promise`
       *
       * @return {Number} An ID used to remove interceptor later
       */
      InterceptorManager.prototype.use = function use(fulfilled, rejected) {
        this.handlers.push({
          fulfilled: fulfilled,
          rejected: rejected
        });
        return this.handlers.length - 1;
      };

      /**
       * Remove an interceptor from the stack
       *
       * @param {Number} id The ID that was returned by `use`
       */
      InterceptorManager.prototype.eject = function eject(id) {
        if (this.handlers[id]) {
          this.handlers[id] = null;
        }
      };

      /**
       * Iterate over all the registered interceptors
       *
       * This method is particularly useful for skipping over any
       * interceptors that may have become `null` calling `eject`.
       *
       * @param {Function} fn The function to call for each interceptor
       */
      InterceptorManager.prototype.forEach = function forEach(fn) {
        utils.forEach(this.handlers, function forEachHandler(h) {
          if (h !== null) {
            fn(h);
          }
        });
      };

      module.exports = InterceptorManager;
    }, { "./../utils": 27 }], 11: [function (require, module, exports) {
      'use strict';

      var enhanceError = require('./enhanceError');

      /**
       * Create an Error with the specified message, config, error code, request and response.
       *
       * @param {string} message The error message.
       * @param {Object} config The config.
       * @param {string} [code] The error code (for example, 'ECONNABORTED').
       * @param {Object} [request] The request.
       * @param {Object} [response] The response.
       * @returns {Error} The created error.
       */
      module.exports = function createError(message, config, code, request, response) {
        var error = new Error(message);
        return enhanceError(error, config, code, request, response);
      };
    }, { "./enhanceError": 13 }], 12: [function (require, module, exports) {
      'use strict';

      var utils = require('./../utils');
      var transformData = require('./transformData');
      var isCancel = require('../cancel/isCancel');
      var defaults = require('../defaults');

      /**
       * Throws a `Cancel` if cancellation has been requested.
       */
      function throwIfCancellationRequested(config) {
        if (config.cancelToken) {
          config.cancelToken.throwIfRequested();
        }
      }

      /**
       * Dispatch a request to the server using the configured adapter.
       *
       * @param {object} config The config that is to be used for the request
       * @returns {Promise} The Promise to be fulfilled
       */
      module.exports = function dispatchRequest(config) {
        throwIfCancellationRequested(config);

        // Ensure headers exist
        config.headers = config.headers || {};

        // Transform request data
        config.data = transformData(config.data, config.headers, config.transformRequest);

        // Flatten headers
        config.headers = utils.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers || {});

        utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], function cleanHeaderConfig(method) {
          delete config.headers[method];
        });

        var adapter = config.adapter || defaults.adapter;

        return adapter(config).then(function onAdapterResolution(response) {
          throwIfCancellationRequested(config);

          // Transform response data
          response.data = transformData(response.data, response.headers, config.transformResponse);

          return response;
        }, function onAdapterRejection(reason) {
          if (!isCancel(reason)) {
            throwIfCancellationRequested(config);

            // Transform response data
            if (reason && reason.response) {
              reason.response.data = transformData(reason.response.data, reason.response.headers, config.transformResponse);
            }
          }

          return Promise.reject(reason);
        });
      };
    }, { "../cancel/isCancel": 8, "../defaults": 16, "./../utils": 27, "./transformData": 15 }], 13: [function (require, module, exports) {
      'use strict';

      /**
       * Update an Error with the specified config, error code, and response.
       *
       * @param {Error} error The error to update.
       * @param {Object} config The config.
       * @param {string} [code] The error code (for example, 'ECONNABORTED').
       * @param {Object} [request] The request.
       * @param {Object} [response] The response.
       * @returns {Error} The error.
       */

      module.exports = function enhanceError(error, config, code, request, response) {
        error.config = config;
        if (code) {
          error.code = code;
        }
        error.request = request;
        error.response = response;
        return error;
      };
    }, {}], 14: [function (require, module, exports) {
      'use strict';

      var createError = require('./createError');

      /**
       * Resolve or reject a Promise based on response status.
       *
       * @param {Function} resolve A function that resolves the promise.
       * @param {Function} reject A function that rejects the promise.
       * @param {object} response The response.
       */
      module.exports = function settle(resolve, reject, response) {
        var validateStatus = response.config.validateStatus;
        // Note: status is not exposed by XDomainRequest
        if (!response.status || !validateStatus || validateStatus(response.status)) {
          resolve(response);
        } else {
          reject(createError('Request failed with status code ' + response.status, response.config, null, response.request, response));
        }
      };
    }, { "./createError": 11 }], 15: [function (require, module, exports) {
      'use strict';

      var utils = require('./../utils');

      /**
       * Transform the data for a request or a response
       *
       * @param {Object|String} data The data to be transformed
       * @param {Array} headers The headers for the request or response
       * @param {Array|Function} fns A single function or Array of functions
       * @returns {*} The resulting transformed data
       */
      module.exports = function transformData(data, headers, fns) {
        /*eslint no-param-reassign:0*/
        utils.forEach(fns, function transform(fn) {
          data = fn(data, headers);
        });

        return data;
      };
    }, { "./../utils": 27 }], 16: [function (require, module, exports) {
      (function (process) {
        'use strict';

        var utils = require('./utils');
        var normalizeHeaderName = require('./helpers/normalizeHeaderName');

        var DEFAULT_CONTENT_TYPE = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };

        function setContentTypeIfUnset(headers, value) {
          if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
            headers['Content-Type'] = value;
          }
        }

        function getDefaultAdapter() {
          var adapter;
          if (typeof XMLHttpRequest !== 'undefined') {
            // For browsers use XHR adapter
            adapter = require('./adapters/xhr');
          } else if (typeof process !== 'undefined') {
            // For node use HTTP adapter
            adapter = require('./adapters/http');
          }
          return adapter;
        }

        var defaults = {
          adapter: getDefaultAdapter(),

          transformRequest: [function transformRequest(data, headers) {
            normalizeHeaderName(headers, 'Content-Type');
            if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
              return data;
            }
            if (utils.isArrayBufferView(data)) {
              return data.buffer;
            }
            if (utils.isURLSearchParams(data)) {
              setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
              return data.toString();
            }
            if (utils.isObject(data)) {
              setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
              return JSON.stringify(data);
            }
            return data;
          }],

          transformResponse: [function transformResponse(data) {
            /*eslint no-param-reassign:0*/
            if (typeof data === 'string') {
              try {
                data = JSON.parse(data);
              } catch (e) {/* Ignore */}
            }
            return data;
          }],

          timeout: 0,

          xsrfCookieName: 'XSRF-TOKEN',
          xsrfHeaderName: 'X-XSRF-TOKEN',

          maxContentLength: -1,

          validateStatus: function validateStatus(status) {
            return status >= 200 && status < 300;
          }
        };

        defaults.headers = {
          common: {
            'Accept': 'application/json, text/plain, */*'
          }
        };

        utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
          defaults.headers[method] = {};
        });

        utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
          defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
        });

        module.exports = defaults;
      }).call(this, require('_process'));
    }, { "./adapters/http": 4, "./adapters/xhr": 4, "./helpers/normalizeHeaderName": 24, "./utils": 27, "_process": 1 }], 17: [function (require, module, exports) {
      'use strict';

      module.exports = function bind(fn, thisArg) {
        return function wrap() {
          var args = new Array(arguments.length);
          for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i];
          }
          return fn.apply(thisArg, args);
        };
      };
    }, {}], 18: [function (require, module, exports) {
      'use strict';

      // btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

      var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

      function E() {
        this.message = 'String contains an invalid character';
      }
      E.prototype = new Error();
      E.prototype.code = 5;
      E.prototype.name = 'InvalidCharacterError';

      function btoa(input) {
        var str = String(input);
        var output = '';
        for (
        // initialize result and counter
        var block, charCode, idx = 0, map = chars;
        // if the next str index does not exist:
        //   change the mapping table to "="
        //   check if d has no fractional digits
        str.charAt(idx | 0) || (map = '=', idx % 1);
        // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
        output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
          charCode = str.charCodeAt(idx += 3 / 4);
          if (charCode > 0xFF) {
            throw new E();
          }
          block = block << 8 | charCode;
        }
        return output;
      }

      module.exports = btoa;
    }, {}], 19: [function (require, module, exports) {
      'use strict';

      var utils = require('./../utils');

      function encode(val) {
        return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
      }

      /**
       * Build a URL by appending params to the end
       *
       * @param {string} url The base of the url (e.g., http://www.google.com)
       * @param {object} [params] The params to be appended
       * @returns {string} The formatted url
       */
      module.exports = function buildURL(url, params, paramsSerializer) {
        /*eslint no-param-reassign:0*/
        if (!params) {
          return url;
        }

        var serializedParams;
        if (paramsSerializer) {
          serializedParams = paramsSerializer(params);
        } else if (utils.isURLSearchParams(params)) {
          serializedParams = params.toString();
        } else {
          var parts = [];

          utils.forEach(params, function serialize(val, key) {
            if (val === null || typeof val === 'undefined') {
              return;
            }

            if (utils.isArray(val)) {
              key = key + '[]';
            }

            if (!utils.isArray(val)) {
              val = [val];
            }

            utils.forEach(val, function parseValue(v) {
              if (utils.isDate(v)) {
                v = v.toISOString();
              } else if (utils.isObject(v)) {
                v = JSON.stringify(v);
              }
              parts.push(encode(key) + '=' + encode(v));
            });
          });

          serializedParams = parts.join('&');
        }

        if (serializedParams) {
          url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
        }

        return url;
      };
    }, { "./../utils": 27 }], 20: [function (require, module, exports) {
      'use strict';

      /**
       * Creates a new URL by combining the specified URLs
       *
       * @param {string} baseURL The base URL
       * @param {string} relativeURL The relative URL
       * @returns {string} The combined URL
       */

      module.exports = function combineURLs(baseURL, relativeURL) {
        return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
      };
    }, {}], 21: [function (require, module, exports) {
      'use strict';

      var utils = require('./../utils');

      module.exports = utils.isStandardBrowserEnv() ?

      // Standard browser envs support document.cookie
      function standardBrowserEnv() {
        return {
          write: function write(name, value, expires, path, domain, secure) {
            var cookie = [];
            cookie.push(name + '=' + encodeURIComponent(value));

            if (utils.isNumber(expires)) {
              cookie.push('expires=' + new Date(expires).toGMTString());
            }

            if (utils.isString(path)) {
              cookie.push('path=' + path);
            }

            if (utils.isString(domain)) {
              cookie.push('domain=' + domain);
            }

            if (secure === true) {
              cookie.push('secure');
            }

            document.cookie = cookie.join('; ');
          },

          read: function read(name) {
            var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
            return match ? decodeURIComponent(match[3]) : null;
          },

          remove: function remove(name) {
            this.write(name, '', Date.now() - 86400000);
          }
        };
      }() :

      // Non standard browser env (web workers, react-native) lack needed support.
      function nonStandardBrowserEnv() {
        return {
          write: function write() {},
          read: function read() {
            return null;
          },
          remove: function remove() {}
        };
      }();
    }, { "./../utils": 27 }], 22: [function (require, module, exports) {
      'use strict';

      /**
       * Determines whether the specified URL is absolute
       *
       * @param {string} url The URL to test
       * @returns {boolean} True if the specified URL is absolute, otherwise false
       */

      module.exports = function isAbsoluteURL(url) {
        // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
        // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
        // by any combination of letters, digits, plus, period, or hyphen.
        return (/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
        );
      };
    }, {}], 23: [function (require, module, exports) {
      'use strict';

      var utils = require('./../utils');

      module.exports = utils.isStandardBrowserEnv() ?

      // Standard browser envs have full support of the APIs needed to test
      // whether the request URL is of the same origin as current location.
      function standardBrowserEnv() {
        var msie = /(msie|trident)/i.test(navigator.userAgent);
        var urlParsingNode = document.createElement('a');
        var originURL;

        /**
        * Parse a URL to discover it's components
        *
        * @param {String} url The URL to be parsed
        * @returns {Object}
        */
        function resolveURL(url) {
          var href = url;

          if (msie) {
            // IE needs attribute set twice to normalize properties
            urlParsingNode.setAttribute('href', href);
            href = urlParsingNode.href;
          }

          urlParsingNode.setAttribute('href', href);

          // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
          return {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: urlParsingNode.pathname.charAt(0) === '/' ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
          };
        }

        originURL = resolveURL(window.location.href);

        /**
        * Determine if a URL shares the same origin as the current location
        *
        * @param {String} requestURL The URL to test
        * @returns {boolean} True if URL shares the same origin, otherwise false
        */
        return function isURLSameOrigin(requestURL) {
          var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
          return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
        };
      }() :

      // Non standard browser envs (web workers, react-native) lack needed support.
      function nonStandardBrowserEnv() {
        return function isURLSameOrigin() {
          return true;
        };
      }();
    }, { "./../utils": 27 }], 24: [function (require, module, exports) {
      'use strict';

      var utils = require('../utils');

      module.exports = function normalizeHeaderName(headers, normalizedName) {
        utils.forEach(headers, function processHeader(value, name) {
          if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
            headers[normalizedName] = value;
            delete headers[name];
          }
        });
      };
    }, { "../utils": 27 }], 25: [function (require, module, exports) {
      'use strict';

      var utils = require('./../utils');

      /**
       * Parse headers into an object
       *
       * ```
       * Date: Wed, 27 Aug 2014 08:58:49 GMT
       * Content-Type: application/json
       * Connection: keep-alive
       * Transfer-Encoding: chunked
       * ```
       *
       * @param {String} headers Headers needing to be parsed
       * @returns {Object} Headers parsed into an object
       */
      module.exports = function parseHeaders(headers) {
        var parsed = {};
        var key;
        var val;
        var i;

        if (!headers) {
          return parsed;
        }

        utils.forEach(headers.split('\n'), function parser(line) {
          i = line.indexOf(':');
          key = utils.trim(line.substr(0, i)).toLowerCase();
          val = utils.trim(line.substr(i + 1));

          if (key) {
            parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
          }
        });

        return parsed;
      };
    }, { "./../utils": 27 }], 26: [function (require, module, exports) {
      'use strict';

      /**
       * Syntactic sugar for invoking a function and expanding an array for arguments.
       *
       * Common use case would be to use `Function.prototype.apply`.
       *
       *  ```js
       *  function f(x, y, z) {}
       *  var args = [1, 2, 3];
       *  f.apply(null, args);
       *  ```
       *
       * With `spread` this example can be re-written.
       *
       *  ```js
       *  spread(function(x, y, z) {})([1, 2, 3]);
       *  ```
       *
       * @param {Function} callback
       * @returns {Function}
       */

      module.exports = function spread(callback) {
        return function wrap(arr) {
          return callback.apply(null, arr);
        };
      };
    }, {}], 27: [function (require, module, exports) {
      'use strict';

      var bind = require('./helpers/bind');
      var isBuffer = require('is-buffer');

      /*global toString:true*/

      // utils is a library of generic helper functions non-specific to axios

      var toString = Object.prototype.toString;

      /**
       * Determine if a value is an Array
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is an Array, otherwise false
       */
      function isArray(val) {
        return toString.call(val) === '[object Array]';
      }

      /**
       * Determine if a value is an ArrayBuffer
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is an ArrayBuffer, otherwise false
       */
      function isArrayBuffer(val) {
        return toString.call(val) === '[object ArrayBuffer]';
      }

      /**
       * Determine if a value is a FormData
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is an FormData, otherwise false
       */
      function isFormData(val) {
        return typeof FormData !== 'undefined' && val instanceof FormData;
      }

      /**
       * Determine if a value is a view on an ArrayBuffer
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
       */
      function isArrayBufferView(val) {
        var result;
        if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
          result = ArrayBuffer.isView(val);
        } else {
          result = val && val.buffer && val.buffer instanceof ArrayBuffer;
        }
        return result;
      }

      /**
       * Determine if a value is a String
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a String, otherwise false
       */
      function isString(val) {
        return typeof val === 'string';
      }

      /**
       * Determine if a value is a Number
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a Number, otherwise false
       */
      function isNumber(val) {
        return typeof val === 'number';
      }

      /**
       * Determine if a value is undefined
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if the value is undefined, otherwise false
       */
      function isUndefined(val) {
        return typeof val === 'undefined';
      }

      /**
       * Determine if a value is an Object
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is an Object, otherwise false
       */
      function isObject(val) {
        return val !== null && (typeof val === "undefined" ? "undefined" : _typeof(val)) === 'object';
      }

      /**
       * Determine if a value is a Date
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a Date, otherwise false
       */
      function isDate(val) {
        return toString.call(val) === '[object Date]';
      }

      /**
       * Determine if a value is a File
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a File, otherwise false
       */
      function isFile(val) {
        return toString.call(val) === '[object File]';
      }

      /**
       * Determine if a value is a Blob
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a Blob, otherwise false
       */
      function isBlob(val) {
        return toString.call(val) === '[object Blob]';
      }

      /**
       * Determine if a value is a Function
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a Function, otherwise false
       */
      function isFunction(val) {
        return toString.call(val) === '[object Function]';
      }

      /**
       * Determine if a value is a Stream
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a Stream, otherwise false
       */
      function isStream(val) {
        return isObject(val) && isFunction(val.pipe);
      }

      /**
       * Determine if a value is a URLSearchParams object
       *
       * @param {Object} val The value to test
       * @returns {boolean} True if value is a URLSearchParams object, otherwise false
       */
      function isURLSearchParams(val) {
        return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
      }

      /**
       * Trim excess whitespace off the beginning and end of a string
       *
       * @param {String} str The String to trim
       * @returns {String} The String freed of excess whitespace
       */
      function trim(str) {
        return str.replace(/^\s*/, '').replace(/\s*$/, '');
      }

      /**
       * Determine if we're running in a standard browser environment
       *
       * This allows axios to run in a web worker, and react-native.
       * Both environments support XMLHttpRequest, but not fully standard globals.
       *
       * web workers:
       *  typeof window -> undefined
       *  typeof document -> undefined
       *
       * react-native:
       *  navigator.product -> 'ReactNative'
       */
      function isStandardBrowserEnv() {
        if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
          return false;
        }
        return typeof window !== 'undefined' && typeof document !== 'undefined';
      }

      /**
       * Iterate over an Array or an Object invoking a function for each item.
       *
       * If `obj` is an Array callback will be called passing
       * the value, index, and complete array for each item.
       *
       * If 'obj' is an Object callback will be called passing
       * the value, key, and complete object for each property.
       *
       * @param {Object|Array} obj The object to iterate
       * @param {Function} fn The callback to invoke for each item
       */
      function forEach(obj, fn) {
        // Don't bother if no value provided
        if (obj === null || typeof obj === 'undefined') {
          return;
        }

        // Force an array if not already something iterable
        if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== 'object' && !isArray(obj)) {
          /*eslint no-param-reassign:0*/
          obj = [obj];
        }

        if (isArray(obj)) {
          // Iterate over array values
          for (var i = 0, l = obj.length; i < l; i++) {
            fn.call(null, obj[i], i, obj);
          }
        } else {
          // Iterate over object keys
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              fn.call(null, obj[key], key, obj);
            }
          }
        }
      }

      /**
       * Accepts varargs expecting each argument to be an object, then
       * immutably merges the properties of each object and returns result.
       *
       * When multiple objects contain the same key the later object in
       * the arguments list will take precedence.
       *
       * Example:
       *
       * ```js
       * var result = merge({foo: 123}, {foo: 456});
       * console.log(result.foo); // outputs 456
       * ```
       *
       * @param {Object} obj1 Object to merge
       * @returns {Object} Result of all merge properties
       */
      function merge() /* obj1, obj2, obj3, ... */{
        var result = {};
        function assignValue(val, key) {
          if (_typeof(result[key]) === 'object' && (typeof val === "undefined" ? "undefined" : _typeof(val)) === 'object') {
            result[key] = merge(result[key], val);
          } else {
            result[key] = val;
          }
        }

        for (var i = 0, l = arguments.length; i < l; i++) {
          forEach(arguments[i], assignValue);
        }
        return result;
      }

      /**
       * Extends object a by mutably adding to it the properties of object b.
       *
       * @param {Object} a The object to be extended
       * @param {Object} b The object to copy properties from
       * @param {Object} thisArg The object to bind function to
       * @return {Object} The resulting value of object a
       */
      function extend(a, b, thisArg) {
        forEach(b, function assignValue(val, key) {
          if (thisArg && typeof val === 'function') {
            a[key] = bind(val, thisArg);
          } else {
            a[key] = val;
          }
        });
        return a;
      }

      module.exports = {
        isArray: isArray,
        isArrayBuffer: isArrayBuffer,
        isBuffer: isBuffer,
        isFormData: isFormData,
        isArrayBufferView: isArrayBufferView,
        isString: isString,
        isNumber: isNumber,
        isObject: isObject,
        isUndefined: isUndefined,
        isDate: isDate,
        isFile: isFile,
        isBlob: isBlob,
        isFunction: isFunction,
        isStream: isStream,
        isURLSearchParams: isURLSearchParams,
        isStandardBrowserEnv: isStandardBrowserEnv,
        forEach: forEach,
        merge: merge,
        extend: extend,
        trim: trim
      };
    }, { "./helpers/bind": 17, "is-buffer": 28 }], 28: [function (require, module, exports) {
      /*!
       * Determine if an object is a Buffer
       *
       * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
       * @license  MIT
       */

      // The _isBuffer check is for Safari 5-7 support, because it's missing
      // Object.prototype.constructor. Remove this eventually
      module.exports = function (obj) {
        return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
      };

      function isBuffer(obj) {
        return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);
      }

      // For Node v0.10 support. Remove this eventually.
      function isSlowBuffer(obj) {
        return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0));
      }
    }, {}], 29: [function (require, module, exports) {
      'use strict';

      var replace = String.prototype.replace;
      var percentTwenties = /%20/g;

      module.exports = {
        'default': 'RFC3986',
        formatters: {
          RFC1738: function RFC1738(value) {
            return replace.call(value, percentTwenties, '+');
          },
          RFC3986: function RFC3986(value) {
            return value;
          }
        },
        RFC1738: 'RFC1738',
        RFC3986: 'RFC3986'
      };
    }, {}], 30: [function (require, module, exports) {
      'use strict';

      var stringify = require('./stringify');
      var parse = require('./parse');
      var formats = require('./formats');

      module.exports = {
        formats: formats,
        parse: parse,
        stringify: stringify
      };
    }, { "./formats": 29, "./parse": 31, "./stringify": 32 }], 31: [function (require, module, exports) {
      'use strict';

      var utils = require('./utils');

      var has = Object.prototype.hasOwnProperty;

      var defaults = {
        allowDots: false,
        allowPrototypes: false,
        arrayLimit: 20,
        decoder: utils.decode,
        delimiter: '&',
        depth: 5,
        parameterLimit: 1000,
        plainObjects: false,
        strictNullHandling: false
      };

      var parseValues = function parseQueryStringValues(str, options) {
        var obj = {};
        var parts = str.split(options.delimiter, options.parameterLimit === Infinity ? undefined : options.parameterLimit);

        for (var i = 0; i < parts.length; ++i) {
          var part = parts[i];
          var pos = part.indexOf(']=') === -1 ? part.indexOf('=') : part.indexOf(']=') + 1;

          var key, val;
          if (pos === -1) {
            key = options.decoder(part);
            val = options.strictNullHandling ? null : '';
          } else {
            key = options.decoder(part.slice(0, pos));
            val = options.decoder(part.slice(pos + 1));
          }
          if (has.call(obj, key)) {
            obj[key] = [].concat(obj[key]).concat(val);
          } else {
            obj[key] = val;
          }
        }

        return obj;
      };

      var parseObject = function parseObjectRecursive(chain, val, options) {
        if (!chain.length) {
          return val;
        }

        var root = chain.shift();

        var obj;
        if (root === '[]') {
          obj = [];
          obj = obj.concat(parseObject(chain, val, options));
        } else {
          obj = options.plainObjects ? Object.create(null) : {};
          var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
          var index = parseInt(cleanRoot, 10);
          if (!isNaN(index) && root !== cleanRoot && String(index) === cleanRoot && index >= 0 && options.parseArrays && index <= options.arrayLimit) {
            obj = [];
            obj[index] = parseObject(chain, val, options);
          } else {
            obj[cleanRoot] = parseObject(chain, val, options);
          }
        }

        return obj;
      };

      var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
        if (!givenKey) {
          return;
        }

        // Transform dot notation to bracket notation
        var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

        // The regex chunks

        var brackets = /(\[[^[\]]*])/;
        var child = /(\[[^[\]]*])/g;

        // Get the parent

        var segment = brackets.exec(key);
        var parent = segment ? key.slice(0, segment.index) : key;

        // Stash the parent if it exists

        var keys = [];
        if (parent) {
          // If we aren't using plain objects, optionally prefix keys
          // that would overwrite object prototype properties
          if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
              return;
            }
          }

          keys.push(parent);
        }

        // Loop through children appending to the array until we hit depth

        var i = 0;
        while ((segment = child.exec(key)) !== null && i < options.depth) {
          i += 1;
          if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
              return;
            }
          }
          keys.push(segment[1]);
        }

        // If there's a remainder, just add whatever is left

        if (segment) {
          keys.push('[' + key.slice(segment.index) + ']');
        }

        return parseObject(keys, val, options);
      };

      module.exports = function (str, opts) {
        var options = opts || {};

        if (options.decoder !== null && options.decoder !== undefined && typeof options.decoder !== 'function') {
          throw new TypeError('Decoder has to be a function.');
        }

        options.delimiter = typeof options.delimiter === 'string' || utils.isRegExp(options.delimiter) ? options.delimiter : defaults.delimiter;
        options.depth = typeof options.depth === 'number' ? options.depth : defaults.depth;
        options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : defaults.arrayLimit;
        options.parseArrays = options.parseArrays !== false;
        options.decoder = typeof options.decoder === 'function' ? options.decoder : defaults.decoder;
        options.allowDots = typeof options.allowDots === 'boolean' ? options.allowDots : defaults.allowDots;
        options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : defaults.plainObjects;
        options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : defaults.allowPrototypes;
        options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : defaults.parameterLimit;
        options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;

        if (str === '' || str === null || typeof str === 'undefined') {
          return options.plainObjects ? Object.create(null) : {};
        }

        var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
        var obj = options.plainObjects ? Object.create(null) : {};

        // Iterate over the keys and setup the new object

        var keys = Object.keys(tempObj);
        for (var i = 0; i < keys.length; ++i) {
          var key = keys[i];
          var newObj = parseKeys(key, tempObj[key], options);
          obj = utils.merge(obj, newObj, options);
        }

        return utils.compact(obj);
      };
    }, { "./utils": 33 }], 32: [function (require, module, exports) {
      'use strict';

      var utils = require('./utils');
      var formats = require('./formats');

      var arrayPrefixGenerators = {
        brackets: function brackets(prefix) {
          // eslint-disable-line func-name-matching
          return prefix + '[]';
        },
        indices: function indices(prefix, key) {
          // eslint-disable-line func-name-matching
          return prefix + '[' + key + ']';
        },
        repeat: function repeat(prefix) {
          // eslint-disable-line func-name-matching
          return prefix;
        }
      };

      var toISO = Date.prototype.toISOString;

      var defaults = {
        delimiter: '&',
        encode: true,
        encoder: utils.encode,
        encodeValuesOnly: false,
        serializeDate: function serializeDate(date) {
          // eslint-disable-line func-name-matching
          return toISO.call(date);
        },
        skipNulls: false,
        strictNullHandling: false
      };

      var stringify = function stringify( // eslint-disable-line func-name-matching
      object, prefix, generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, formatter, encodeValuesOnly) {
        var obj = object;
        if (typeof filter === 'function') {
          obj = filter(prefix, obj);
        } else if (obj instanceof Date) {
          obj = serializeDate(obj);
        } else if (obj === null) {
          if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix) : prefix;
          }

          obj = '';
        }

        if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
          if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix);
            return [formatter(keyValue) + '=' + formatter(encoder(obj))];
          }
          return [formatter(prefix) + '=' + formatter(String(obj))];
        }

        var values = [];

        if (typeof obj === 'undefined') {
          return values;
        }

        var objKeys;
        if (Array.isArray(filter)) {
          objKeys = filter;
        } else {
          var keys = Object.keys(obj);
          objKeys = sort ? keys.sort(sort) : keys;
        }

        for (var i = 0; i < objKeys.length; ++i) {
          var key = objKeys[i];

          if (skipNulls && obj[key] === null) {
            continue;
          }

          if (Array.isArray(obj)) {
            values = values.concat(stringify(obj[key], generateArrayPrefix(prefix, key), generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, formatter, encodeValuesOnly));
          } else {
            values = values.concat(stringify(obj[key], prefix + (allowDots ? '.' + key : '[' + key + ']'), generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, formatter, encodeValuesOnly));
          }
        }

        return values;
      };

      module.exports = function (object, opts) {
        var obj = object;
        var options = opts || {};

        if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
          throw new TypeError('Encoder has to be a function.');
        }

        var delimiter = typeof options.delimiter === 'undefined' ? defaults.delimiter : options.delimiter;
        var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
        var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults.skipNulls;
        var encode = typeof options.encode === 'boolean' ? options.encode : defaults.encode;
        var encoder = typeof options.encoder === 'function' ? options.encoder : defaults.encoder;
        var sort = typeof options.sort === 'function' ? options.sort : null;
        var allowDots = typeof options.allowDots === 'undefined' ? false : options.allowDots;
        var serializeDate = typeof options.serializeDate === 'function' ? options.serializeDate : defaults.serializeDate;
        var encodeValuesOnly = typeof options.encodeValuesOnly === 'boolean' ? options.encodeValuesOnly : defaults.encodeValuesOnly;
        if (typeof options.format === 'undefined') {
          options.format = formats.default;
        } else if (!Object.prototype.hasOwnProperty.call(formats.formatters, options.format)) {
          throw new TypeError('Unknown format option provided.');
        }
        var formatter = formats.formatters[options.format];
        var objKeys;
        var filter;

        if (typeof options.filter === 'function') {
          filter = options.filter;
          obj = filter('', obj);
        } else if (Array.isArray(options.filter)) {
          filter = options.filter;
          objKeys = filter;
        }

        var keys = [];

        if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== 'object' || obj === null) {
          return '';
        }

        var arrayFormat;
        if (options.arrayFormat in arrayPrefixGenerators) {
          arrayFormat = options.arrayFormat;
        } else if ('indices' in options) {
          arrayFormat = options.indices ? 'indices' : 'repeat';
        } else {
          arrayFormat = 'indices';
        }

        var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

        if (!objKeys) {
          objKeys = Object.keys(obj);
        }

        if (sort) {
          objKeys.sort(sort);
        }

        for (var i = 0; i < objKeys.length; ++i) {
          var key = objKeys[i];

          if (skipNulls && obj[key] === null) {
            continue;
          }

          keys = keys.concat(stringify(obj[key], key, generateArrayPrefix, strictNullHandling, skipNulls, encode ? encoder : null, filter, sort, allowDots, serializeDate, formatter, encodeValuesOnly));
        }

        return keys.join(delimiter);
      };
    }, { "./formats": 29, "./utils": 33 }], 33: [function (require, module, exports) {
      'use strict';

      var has = Object.prototype.hasOwnProperty;

      var hexTable = function () {
        var array = [];
        for (var i = 0; i < 256; ++i) {
          array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
        }

        return array;
      }();

      exports.arrayToObject = function (source, options) {
        var obj = options && options.plainObjects ? Object.create(null) : {};
        for (var i = 0; i < source.length; ++i) {
          if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
          }
        }

        return obj;
      };

      exports.merge = function (target, source, options) {
        if (!source) {
          return target;
        }

        if ((typeof source === "undefined" ? "undefined" : _typeof(source)) !== 'object') {
          if (Array.isArray(target)) {
            target.push(source);
          } else if ((typeof target === "undefined" ? "undefined" : _typeof(target)) === 'object') {
            if (options.plainObjects || options.allowPrototypes || !has.call(Object.prototype, source)) {
              target[source] = true;
            }
          } else {
            return [target, source];
          }

          return target;
        }

        if ((typeof target === "undefined" ? "undefined" : _typeof(target)) !== 'object') {
          return [target].concat(source);
        }

        var mergeTarget = target;
        if (Array.isArray(target) && !Array.isArray(source)) {
          mergeTarget = exports.arrayToObject(target, options);
        }

        if (Array.isArray(target) && Array.isArray(source)) {
          source.forEach(function (item, i) {
            if (has.call(target, i)) {
              if (target[i] && _typeof(target[i]) === 'object') {
                target[i] = exports.merge(target[i], item, options);
              } else {
                target.push(item);
              }
            } else {
              target[i] = item;
            }
          });
          return target;
        }

        return Object.keys(source).reduce(function (acc, key) {
          var value = source[key];

          if (Object.prototype.hasOwnProperty.call(acc, key)) {
            acc[key] = exports.merge(acc[key], value, options);
          } else {
            acc[key] = value;
          }
          return acc;
        }, mergeTarget);
      };

      exports.decode = function (str) {
        try {
          return decodeURIComponent(str.replace(/\+/g, ' '));
        } catch (e) {
          return str;
        }
      };

      exports.encode = function (str) {
        // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
        // It has been adapted here for stricter adherence to RFC 3986
        if (str.length === 0) {
          return str;
        }

        var string = typeof str === 'string' ? str : String(str);

        var out = '';
        for (var i = 0; i < string.length; ++i) {
          var c = string.charCodeAt(i);

          if (c === 0x2D || // -
          c === 0x2E || // .
          c === 0x5F || // _
          c === 0x7E || // ~
          c >= 0x30 && c <= 0x39 || // 0-9
          c >= 0x41 && c <= 0x5A || // a-z
          c >= 0x61 && c <= 0x7A // A-Z
          ) {
              out += string.charAt(i);
              continue;
            }

          if (c < 0x80) {
            out = out + hexTable[c];
            continue;
          }

          if (c < 0x800) {
            out = out + (hexTable[0xC0 | c >> 6] + hexTable[0x80 | c & 0x3F]);
            continue;
          }

          if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | c >> 12] + hexTable[0x80 | c >> 6 & 0x3F] + hexTable[0x80 | c & 0x3F]);
            continue;
          }

          i += 1;
          c = 0x10000 + ((c & 0x3FF) << 10 | string.charCodeAt(i) & 0x3FF);
          out += hexTable[0xF0 | c >> 18] + hexTable[0x80 | c >> 12 & 0x3F] + hexTable[0x80 | c >> 6 & 0x3F] + hexTable[0x80 | c & 0x3F]; // eslint-disable-line max-len
        }

        return out;
      };

      exports.compact = function (obj, references) {
        if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== 'object' || obj === null) {
          return obj;
        }

        var refs = references || [];
        var lookup = refs.indexOf(obj);
        if (lookup !== -1) {
          return refs[lookup];
        }

        refs.push(obj);

        if (Array.isArray(obj)) {
          var compacted = [];

          for (var i = 0; i < obj.length; ++i) {
            if (obj[i] && _typeof(obj[i]) === 'object') {
              compacted.push(exports.compact(obj[i], refs));
            } else if (typeof obj[i] !== 'undefined') {
              compacted.push(obj[i]);
            }
          }

          return compacted;
        }

        var keys = Object.keys(obj);
        keys.forEach(function (key) {
          obj[key] = exports.compact(obj[key], refs);
        });

        return obj;
      };

      exports.isRegExp = function (obj) {
        return Object.prototype.toString.call(obj) === '[object RegExp]';
      };

      exports.isBuffer = function (obj) {
        if (obj === null || typeof obj === 'undefined') {
          return false;
        }

        return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
      };
    }, {}], 34: [function (require, module, exports) {
      var OPERATION_SUCCESS = 0;
      var OPERATION_FAILD = 1;
      var WRONG_RAND_NUMBER = 2;
      var DATA_EXIST = 3;
      var NO_AUTHENTICATION = 5;
      var WRONG_USER_NAME = 6;
      var WRONG_USER_PASS = 7;
      var INVALID_USER = 8;
      var INVALID_DATA = 9;
      var USERNAME_EXIST = 10;
      var USER_EMAIL_EXIST = 11;

      var axios = require('axios');
      // var urllib = require('urllib');


      var qs = require('qs');

      var STS = require('./sts');

      // axios 配置
      /**
      axios.defaults.timeout = 120000;
      axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
       */
      // axios.defaults.baseURL = 'http://192.168.1.12:8080/';
      // axios.defaults.baseURL = 'http://192.168.202.16:8080/';

      //POST传参序列化

      axios.interceptors.request.use(function (config) {
        if (config.method === 'post') {
          // console.log(config);
          /**
          console.log(config);
          var ps = {};
          var headers = {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          };
          if (config.data != null && config.data != "undefined") {
            var o = config.data;
            if (typeof (config.data) == 'string')
              o = qs.parse(config.data);
             for (var key in o) {
              // console.log(key + ": " + config.data[key]);
              if (key.indexOf("header_") == 0)
                headers[key.substring(7)] = o[key];
              else
                ps[key] = o[key];
            }
          }
          ps.REQUEST_TYPE = "api";
          */

          // config.headers = headers;
          config.data = "";
          // config.params = ps;
          // console.log(qs.stringify(ps));
          // console.log(config);
        }
        return config;
      }, function (error) {
        // _.toast("错误的传参", 'fail');
        return Promise.reject(error);
      });

      /**
      //返回状态判断
      axios.interceptors.response.use(function (res) {
        if (res.data.result != 0) {
          // _.toast(res.data.msg);
          return Promise.reject(res);
        }
        return res.data;
      }, function (error) {
        // _.toast("网络异常", 'fail');
        return Promise.reject(error);
      });
       */

      function fetchAction(url, headers, params) {
        return new Promise(function (resolve, reject) {

          // urllib.request(url, {
          //   method: 'POST',
          //   headers: headers,
          //   data: params
          // })

          if (console) {
            console.log(new Date().getTime());
            console.log(url);
          }
          // console.log(headers);
          // console.log(params);

          axios.post(url, params, { headers: headers, params: params, data: params, timeout: 120000 }).then(function (response) {
            if (console) {
              console.log(new Date().getTime());
              console.log(response);
            }
            if (response.data.result == 0) resolve(response.data.data);else reject(response.data);
          }).catch(function (error) {
            if (console) {
              console.log(new Date().getTime());
              console.log(error);
            }
            reject(error);
          });
        });
      }

      function HttpClient() {
        this.tokenUtil = new STS();
        this.tokenUtil.setHttpClient(this);
      }

      HttpClient.prototype.init = function (options) {
        this.tokenUtil.init(options);
      };

      /**
       * http请求获取数据
       *
       * @param  {string} url    请求的URL，相对路径
       * @param  {Object} params 请求的参数
       * @return {Object}        请求返回的数据
       */
      HttpClient.prototype.fetch = function (url, params) {
        params = params || {};
        params.REQUEST_TYPE = "api";
        var headers = { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' };
        var userToken = window.localStorage.getItem("user_access_token");
        try {
          if (userToken != null) userToken = JSON.parse(userToken);
          if (userToken && userToken.access_token) headers.userAccessToken = userToken.access_token;
        } catch (e) {}

        if (url == this.tokenUtil.config.AUTH_SERVER) {
          console.log("AUTHEN_CODE: " + this.tokenUtil.config.AUTHEN_CODE);
          headers.Authorization = "Basic " + this.tokenUtil.config.AUTHEN_CODE;
          // params.header_Authorization = "Basic " + this.tokenUtil.config.AUTHEN_CODE;
          return fetchAction(url, headers, params);
        } else {

          return this.tokenUtil.getToken().then(function (t) {
            // params.header_apiAccessToken = token;
            headers.apiAccessToken = t;
            return fetchAction(url, headers, params);
          }, function (err) {
            // console.log(err);
            return fetchAction(url, headers, params);
          });
        }
      };

      //
      // get http request message with code
      //
      // @param resultCode code
      // @return result message
      //
      /**
       * get http request message with code
       * @param  {[type]} resultCode resultCode code
       * @param  {[type]} lang       默认 zh
       * @return {[type]}            result message
       */
      HttpClient.prototype.getResultMessage = function (resultCode, lang) {
        if (lang == "en") {
          switch (resultCode) {
            case OPERATION_SUCCESS:
              return "Success";
            case OPERATION_FAILD:
              return "Failed";
            case WRONG_RAND_NUMBER:
              return "Wrong verify code";
            case DATA_EXIST:
              return "Data duplicate";
            case NO_AUTHENTICATION:
              return "Authentication failed";
            case WRONG_USER_NAME:
              return "Wrong user name";
            case WRONG_USER_PASS:
              return "Wrong password";
            case INVALID_USER:
              return "invalid user";
            case INVALID_DATA:
              return "Invalid parameter[s]";
            case USERNAME_EXIST:
              return "User exist";
            case USER_EMAIL_EXIST:
              return "Email exist";
            default:
              return "System failed";
          }
        } else {
          switch (resultCode) {
            case OPERATION_SUCCESS:
              return "操作成功";
            case OPERATION_FAILD:
              return "操作失败";
            case WRONG_RAND_NUMBER:
              return "验证码错误";
            case DATA_EXIST:
              return "输入错误或记录已存在";
            case NO_AUTHENTICATION:
              return "您没有权限进行该操作";
            case WRONG_USER_NAME:
              return "错误的用户名";
            case WRONG_USER_PASS:
              return "密码错误";
            case INVALID_USER:
              return "无效的用户(未激活或已注销)";
            case INVALID_DATA:
              return "输入错误或信息无效";
            case USERNAME_EXIST:
              return "昵称已存在";
            case USER_EMAIL_EXIST:
              return "邮箱已存在";
            default:
              return "处理失败，请检查您的操作";
          }
        }
      };

      module.exports = HttpClient;
      // module.exports = BceBaseClient;
    }, { "./sts": 35, "axios": 3, "qs": 30 }], 35: [function (require, module, exports) {
      //
      // token utils
      //
      // - get stored token
      // - update token before expired automaticly
      //
      // var httpClient = new HttpClient();

      function STS(options) {
        this.config = {
          AUTH_SERVER: "https://appkey.careerforce.cn/oauth/accessToken",
          AUTHEN_CODE: "MjIzNTgzMTUzOjhhMzUwY2ZjZWY1ODQ3NjMyMzg1NzZlMzljZWNhMGVj",
          TOKEN_STORAGE_NAME: "ACCESS_TOKEN"
        };

        if ("undefined" != typeof options && options != null) for (property in options) {
          this.config[property] = options[property];
        }this._httpClient = null;
      }

      STS.prototype.setHttpClient = function (hClient) {
        this._httpClient = hClient;
      };

      STS.prototype.init = function (options) {
        if ("undefined" != typeof options && options != null) for (property in options) {
          this.config[property] = options[property];
        }
      };

      STS.prototype.expire = function () {
        window.localStorage.removeItem(this.config.TOKEN_STORAGE_NAME);
      };

      /**
       * loadToken: 从服务端获取新的Token
       */
      STS.prototype.loadToken = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
          // console.log("loading token action...");
          // console.log(_this._httpClient);
          // this._httpClient = new HttpClient();
          // if (this._httpClient == null)
          //   this._httpClient = httpClient;

          _this._httpClient.fetch(_this.config.AUTH_SERVER, {
            // HttpClient.fetch(this.config.AUTH_SERVER, {
            grant_type: 'client_credentials'
          }).then(function (res) {
            // console.log(res);
            window.localStorage.setItem(_this.config.TOKEN_STORAGE_NAME, JSON.stringify({
              token: res.access_token,
              expireTime: parseInt(new Date().getTime() / 1000) + res.expires_in
            }));

            resolve(res.access_token);
          }).catch(function (error) {
            reject(error);
            console.log(error);
          });
        });
      };

      /**
       * get token
       * @return token string
       */
      STS.prototype.getToken = function () {
        // console.log("getting token...");

        var _this = this;

        return new Promise(function (resolve, reject) {

          var tokenObject = window.localStorage.getItem(_this.config.TOKEN_STORAGE_NAME);
          // console.log(tokenObject);
          if (tokenObject && tokenObject != null && tokenObject != "") {
            var userToken = JSON.parse(tokenObject);
            if (userToken != null) {
              // 判断是否过期
              var expireTime = userToken.expireTime;
              var nowTime = parseInt(new Date().getTime() / 1000);
              // console.log(expireTime + "getting token..." + nowTime);
              // 如果过期时间小于20s，获取新的 token 并返回
              if (expireTime - nowTime > 20) {
                resolve(userToken.token);
                return;
              }
            }
          }

          _this.loadToken().then(function (token) {
            resolve(token);
          }).catch(function (error) {
            reject(error);
          });
        });
      };

      module.exports = STS;
    }, {}], 36: [function (require, module, exports) {
      /**
       * Created by me on 2017/6/20.
       */
      var HTTP = require('./http_client');
      var http = new HTTP();
      var wxlogn = require('./wxlogin');
      var axios = require('axios');
      function wx_share() {
        this.config = {
          wx_title: "免费高空跳伞,我已成为体验师,你约吗?",
          wx_summary: "免费报名即有机会体验高空跳伞,走过路过不要错过哦~",
          wx_title_summary: "免费高空跳伞,我已成为体验师,你约吗?",
          wx_link: 'http://cms.111ji.com/event/public/url?url=http%3A%2F%2Fwww.111ji.com%2Fsign',
          wx_picture: "http://www.111ji.com/static/share.jpg",
          wx_service_url: 'http://wx.service.careerforce.cn/wx/weixin/jsapi/signature',
          jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
        };
        this.init = function (wx, _config) {
          var uesrInfostr = localStorage.getItem('WX_info');
          var uesrInfo = JSON.parse(uesrInfostr);
          Object.assign(this.config, _config);
          var config = this.config;
          var p = { "wxid": 3, "urlAddress": window.location.href.split("#")[0] };
          axios.get(config.wx_service_url, { params: p }).then(function (data) {
            // console.log(data.data)
            wx.config({
              debug: false,
              appId: data.data.data.appId,
              timestamp: data.data.data.timestamp,
              nonceStr: data.data.data.nonceStr,
              url: window.location.href.split("#")[0],
              signature: data.data.data.signature,
              jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
            });

            wx.ready(function () {

              var linkStr = config.wx_link + '&userId=' + uesrInfo.user.id + '&userName=' + encodeURIComponent(uesrInfo.user.name);
              // console.log(linkStr);

              wx.onMenuShareAppMessage({
                title: config.wx_title,
                desc: config.wx_summary,
                link: linkStr,
                imgUrl: config.wx_picture,
                trigger: function trigger(res) {},
                success: function success(res) {},
                cancel: function cancel(res) {},
                fail: function fail(res) {}
              });
              wx.onMenuShareTimeline({
                title: config.wx_title_summary,
                link: linkStr,
                imgUrl: config.wx_picture,
                trigger: function trigger(res) {},
                success: function success(res) {

                  $("<p style='position: fixed;top: 0;left: 0; right: 0; background: #e3e3e3; line-height: 33px;'>shared success</p >").appendTo($(document.body));
                },
                cancel: function cancel(res) {},
                fail: function fail(res) {}
              });
            });
          }, function (err) {
            console.log(err);

            console.log('发生了错误');
          });
        };
      }

      //公共方法
      wx_share.prototype = {};

      module.exports = wx_share;
    }, { "./http_client": 34, "./wxlogin": 37, "axios": 3 }], 37: [function (require, module, exports) {
      /**
       * Created by me on 2017/6/20.
       */
      var HTTP = require('./http_client');
      var http = new HTTP();

      function wxlogin(config) {
        this.config = {
          current_url: window.location.href,
          wxid: 3,
          WECHAT_CALLBACK_URL: "",
          WECHAT_APP_ID: "",
          _WXURL: "http://wx.service.careerforce.cn/wx/user/oauth/info"
        };
        this.init = function (cfsdk, config) {
          Object.assign(this.config, config);
          var code = this.GetQueryString("code");
          if (code != null && code.toString().length > 1) {
            //如果存在code 已经授权
            // console.log('已授权')
            // console.log(code);
            var openId = this.GetQueryString("openId");
            if (openId != null) localStorage.setItem("wxUserOpenId", openId);
            return new Promise(function (resolve, reject) {
              cfsdk.httpUtil.fetch('https://appkey.careerforce.cn/oauth/accessToken', {
                grant_type: 'authorization_code',
                code: code,
                openType: "weixin",
                redirect_uri: '123'
              }).then(function (response) {
                resolve(response);
              }).catch(function (error) {
                reject(error);
              });
            });
          } else {
            //没有code
            var url = this.config._WXURL;
            var redirectURI = this.config.current_url;
            window.document.location.href = url + "?wxid=" + this.config.wxid + "&redirectURI=" + redirectURI;
            // return new Promise(function (resolve, reject) {resolve(null);});
          }
        };
      }

      //公共方法
      wxlogin.prototype = {
        GetQueryString: function GetQueryString(name) {
          var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
          var r = window.location.search.substr(1).match(reg);
          if (r != null) return unescape(r[2]);
          return null;
        }

      };

      module.exports = wxlogin;
    }, { "./http_client": 34 }] }, {}, [2])(2);
});
