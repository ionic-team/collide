!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.collide=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
module.exports = _dereq_('./lib/extend');


},{"./lib/extend":2}],2:[function(_dereq_,module,exports){
/*!
 * node.extend
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * @fileoverview
 * Port of jQuery.extend that actually works on node.js
 */
var is = _dereq_('is');

function extend() {
  var target = arguments[0] || {};
  var i = 1;
  var length = arguments.length;
  var deep = false;
  var options, name, src, copy, copy_is_array, clone;

  // Handle a deep copy situation
  if (typeof target === 'boolean') {
    deep = target;
    target = arguments[1] || {};
    // skip the boolean and the target
    i = 2;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== 'object' && !is.fn(target)) {
    target = {};
  }

  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    options = arguments[i]
    if (options != null) {
      if (typeof options === 'string') {
          options = options.split('');
      }
      // Extend the base object
      for (name in options) {
        src = target[name];
        copy = options[name];

        // Prevent never-ending loop
        if (target === copy) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if (deep && copy && (is.hash(copy) || (copy_is_array = is.array(copy)))) {
          if (copy_is_array) {
            copy_is_array = false;
            clone = src && is.array(src) ? src : [];
          } else {
            clone = src && is.hash(src) ? src : {};
          }

          // Never move original objects, clone them
          target[name] = extend(deep, clone, copy);

        // Don't bring in undefined values
        } else if (typeof copy !== 'undefined') {
          target[name] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

/**
 * @public
 */
extend.version = '1.0.8';

/**
 * Exports module.
 */
module.exports = extend;


},{"is":3}],3:[function(_dereq_,module,exports){

/**!
 * is
 * the definitive JavaScript type testing library
 * 
 * @copyright 2013 Enrico Marino
 * @license MIT
 */

var objProto = Object.prototype;
var owns = objProto.hasOwnProperty;
var toString = objProto.toString;
var isActualNaN = function (value) {
  return value !== value;
};
var NON_HOST_TYPES = {
  "boolean": 1,
  "number": 1,
  "string": 1,
  "undefined": 1
};

/**
 * Expose `is`
 */

var is = module.exports = {};

/**
 * Test general.
 */

/**
 * is.type
 * Test if `value` is a type of `type`.
 *
 * @param {Mixed} value value to test
 * @param {String} type type
 * @return {Boolean} true if `value` is a type of `type`, false otherwise
 * @api public
 */

is.a =
is.type = function (value, type) {
  return typeof value === type;
};

/**
 * is.defined
 * Test if `value` is defined.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is defined, false otherwise
 * @api public
 */

is.defined = function (value) {
  return value !== undefined;
};

/**
 * is.empty
 * Test if `value` is empty.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is empty, false otherwise
 * @api public
 */

is.empty = function (value) {
  var type = toString.call(value);
  var key;

  if ('[object Array]' === type || '[object Arguments]' === type) {
    return value.length === 0;
  }

  if ('[object Object]' === type) {
    for (key in value) if (owns.call(value, key)) return false;
    return true;
  }

  if ('[object String]' === type) {
    return '' === value;
  }

  return false;
};

/**
 * is.equal
 * Test if `value` is equal to `other`.
 *
 * @param {Mixed} value value to test
 * @param {Mixed} other value to compare with
 * @return {Boolean} true if `value` is equal to `other`, false otherwise
 */

is.equal = function (value, other) {
  var strictlyEqual = value === other;
  if (strictlyEqual) {
    return true;
  }

  var type = toString.call(value);
  var key;

  if (type !== toString.call(other)) {
    return false;
  }

  if ('[object Object]' === type) {
    for (key in value) {
      if (!is.equal(value[key], other[key]) || !(key in other)) {
        return false;
      }
    }
    for (key in other) {
      if (!is.equal(value[key], other[key]) || !(key in value)) {
        return false;
      }
    }
    return true;
  }

  if ('[object Array]' === type) {
    key = value.length;
    if (key !== other.length) {
      return false;
    }
    while (--key) {
      if (!is.equal(value[key], other[key])) {
        return false;
      }
    }
    return true;
  }

  if ('[object Function]' === type) {
    return value.prototype === other.prototype;
  }

  if ('[object Date]' === type) {
    return value.getTime() === other.getTime();
  }

  return strictlyEqual;
};

/**
 * is.hosted
 * Test if `value` is hosted by `host`.
 *
 * @param {Mixed} value to test
 * @param {Mixed} host host to test with
 * @return {Boolean} true if `value` is hosted by `host`, false otherwise
 * @api public
 */

is.hosted = function (value, host) {
  var type = typeof host[value];
  return type === 'object' ? !!host[value] : !NON_HOST_TYPES[type];
};

/**
 * is.instance
 * Test if `value` is an instance of `constructor`.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an instance of `constructor`
 * @api public
 */

is.instance = is['instanceof'] = function (value, constructor) {
  return value instanceof constructor;
};

/**
 * is.null
 * Test if `value` is null.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is null, false otherwise
 * @api public
 */

is['null'] = function (value) {
  return value === null;
};

/**
 * is.undef
 * Test if `value` is undefined.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is undefined, false otherwise
 * @api public
 */

is.undef = is['undefined'] = function (value) {
  return value === undefined;
};

/**
 * Test arguments.
 */

/**
 * is.args
 * Test if `value` is an arguments object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an arguments object, false otherwise
 * @api public
 */

is.args = is['arguments'] = function (value) {
  var isStandardArguments = '[object Arguments]' === toString.call(value);
  var isOldArguments = !is.array(value) && is.arraylike(value) && is.object(value) && is.fn(value.callee);
  return isStandardArguments || isOldArguments;
};

/**
 * Test array.
 */

/**
 * is.array
 * Test if 'value' is an array.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an array, false otherwise
 * @api public
 */

is.array = function (value) {
  return '[object Array]' === toString.call(value);
};

/**
 * is.arguments.empty
 * Test if `value` is an empty arguments object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an empty arguments object, false otherwise
 * @api public
 */
is.args.empty = function (value) {
  return is.args(value) && value.length === 0;
};

/**
 * is.array.empty
 * Test if `value` is an empty array.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an empty array, false otherwise
 * @api public
 */
is.array.empty = function (value) {
  return is.array(value) && value.length === 0;
};

/**
 * is.arraylike
 * Test if `value` is an arraylike object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an arguments object, false otherwise
 * @api public
 */

is.arraylike = function (value) {
  return !!value && !is.boolean(value)
    && owns.call(value, 'length')
    && isFinite(value.length)
    && is.number(value.length)
    && value.length >= 0;
};

/**
 * Test boolean.
 */

/**
 * is.boolean
 * Test if `value` is a boolean.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a boolean, false otherwise
 * @api public
 */

is.boolean = function (value) {
  return '[object Boolean]' === toString.call(value);
};

/**
 * is.false
 * Test if `value` is false.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is false, false otherwise
 * @api public
 */

is['false'] = function (value) {
  return is.boolean(value) && (value === false || value.valueOf() === false);
};

/**
 * is.true
 * Test if `value` is true.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is true, false otherwise
 * @api public
 */

is['true'] = function (value) {
  return is.boolean(value) && (value === true || value.valueOf() === true);
};

/**
 * Test date.
 */

/**
 * is.date
 * Test if `value` is a date.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a date, false otherwise
 * @api public
 */

is.date = function (value) {
  return '[object Date]' === toString.call(value);
};

/**
 * Test element.
 */

/**
 * is.element
 * Test if `value` is an html element.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an HTML Element, false otherwise
 * @api public
 */

is.element = function (value) {
  return value !== undefined
    && typeof HTMLElement !== 'undefined'
    && value instanceof HTMLElement
    && value.nodeType === 1;
};

/**
 * Test error.
 */

/**
 * is.error
 * Test if `value` is an error object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an error object, false otherwise
 * @api public
 */

is.error = function (value) {
  return '[object Error]' === toString.call(value);
};

/**
 * Test function.
 */

/**
 * is.fn / is.function (deprecated)
 * Test if `value` is a function.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a function, false otherwise
 * @api public
 */

is.fn = is['function'] = function (value) {
  var isAlert = typeof window !== 'undefined' && value === window.alert;
  return isAlert || '[object Function]' === toString.call(value);
};

/**
 * Test number.
 */

/**
 * is.number
 * Test if `value` is a number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a number, false otherwise
 * @api public
 */

is.number = function (value) {
  return '[object Number]' === toString.call(value);
};

/**
 * is.infinite
 * Test if `value` is positive or negative infinity.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is positive or negative Infinity, false otherwise
 * @api public
 */
is.infinite = function (value) {
  return value === Infinity || value === -Infinity;
};

/**
 * is.decimal
 * Test if `value` is a decimal number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a decimal number, false otherwise
 * @api public
 */

is.decimal = function (value) {
  return is.number(value) && !isActualNaN(value) && !is.infinite(value) && value % 1 !== 0;
};

/**
 * is.divisibleBy
 * Test if `value` is divisible by `n`.
 *
 * @param {Number} value value to test
 * @param {Number} n dividend
 * @return {Boolean} true if `value` is divisible by `n`, false otherwise
 * @api public
 */

is.divisibleBy = function (value, n) {
  var isDividendInfinite = is.infinite(value);
  var isDivisorInfinite = is.infinite(n);
  var isNonZeroNumber = is.number(value) && !isActualNaN(value) && is.number(n) && !isActualNaN(n) && n !== 0;
  return isDividendInfinite || isDivisorInfinite || (isNonZeroNumber && value % n === 0);
};

/**
 * is.int
 * Test if `value` is an integer.
 *
 * @param value to test
 * @return {Boolean} true if `value` is an integer, false otherwise
 * @api public
 */

is.int = function (value) {
  return is.number(value) && !isActualNaN(value) && value % 1 === 0;
};

/**
 * is.maximum
 * Test if `value` is greater than 'others' values.
 *
 * @param {Number} value value to test
 * @param {Array} others values to compare with
 * @return {Boolean} true if `value` is greater than `others` values
 * @api public
 */

is.maximum = function (value, others) {
  if (isActualNaN(value)) {
    throw new TypeError('NaN is not a valid value');
  } else if (!is.arraylike(others)) {
    throw new TypeError('second argument must be array-like');
  }
  var len = others.length;

  while (--len >= 0) {
    if (value < others[len]) {
      return false;
    }
  }

  return true;
};

/**
 * is.minimum
 * Test if `value` is less than `others` values.
 *
 * @param {Number} value value to test
 * @param {Array} others values to compare with
 * @return {Boolean} true if `value` is less than `others` values
 * @api public
 */

is.minimum = function (value, others) {
  if (isActualNaN(value)) {
    throw new TypeError('NaN is not a valid value');
  } else if (!is.arraylike(others)) {
    throw new TypeError('second argument must be array-like');
  }
  var len = others.length;

  while (--len >= 0) {
    if (value > others[len]) {
      return false;
    }
  }

  return true;
};

/**
 * is.nan
 * Test if `value` is not a number.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is not a number, false otherwise
 * @api public
 */

is.nan = function (value) {
  return !is.number(value) || value !== value;
};

/**
 * is.even
 * Test if `value` is an even number.
 *
 * @param {Number} value value to test
 * @return {Boolean} true if `value` is an even number, false otherwise
 * @api public
 */

is.even = function (value) {
  return is.infinite(value) || (is.number(value) && value === value && value % 2 === 0);
};

/**
 * is.odd
 * Test if `value` is an odd number.
 *
 * @param {Number} value value to test
 * @return {Boolean} true if `value` is an odd number, false otherwise
 * @api public
 */

is.odd = function (value) {
  return is.infinite(value) || (is.number(value) && value === value && value % 2 !== 0);
};

/**
 * is.ge
 * Test if `value` is greater than or equal to `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean}
 * @api public
 */

is.ge = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value >= other;
};

/**
 * is.gt
 * Test if `value` is greater than `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean}
 * @api public
 */

is.gt = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value > other;
};

/**
 * is.le
 * Test if `value` is less than or equal to `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean} if 'value' is less than or equal to 'other'
 * @api public
 */

is.le = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value <= other;
};

/**
 * is.lt
 * Test if `value` is less than `other`.
 *
 * @param {Number} value value to test
 * @param {Number} other value to compare with
 * @return {Boolean} if `value` is less than `other`
 * @api public
 */

is.lt = function (value, other) {
  if (isActualNaN(value) || isActualNaN(other)) {
    throw new TypeError('NaN is not a valid value');
  }
  return !is.infinite(value) && !is.infinite(other) && value < other;
};

/**
 * is.within
 * Test if `value` is within `start` and `finish`.
 *
 * @param {Number} value value to test
 * @param {Number} start lower bound
 * @param {Number} finish upper bound
 * @return {Boolean} true if 'value' is is within 'start' and 'finish'
 * @api public
 */
is.within = function (value, start, finish) {
  if (isActualNaN(value) || isActualNaN(start) || isActualNaN(finish)) {
    throw new TypeError('NaN is not a valid value');
  } else if (!is.number(value) || !is.number(start) || !is.number(finish)) {
    throw new TypeError('all arguments must be numbers');
  }
  var isAnyInfinite = is.infinite(value) || is.infinite(start) || is.infinite(finish);
  return isAnyInfinite || (value >= start && value <= finish);
};

/**
 * Test object.
 */

/**
 * is.object
 * Test if `value` is an object.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is an object, false otherwise
 * @api public
 */

is.object = function (value) {
  return value && '[object Object]' === toString.call(value);
};

/**
 * is.hash
 * Test if `value` is a hash - a plain object literal.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a hash, false otherwise
 * @api public
 */

is.hash = function (value) {
  return is.object(value) && value.constructor === Object && !value.nodeType && !value.setInterval;
};

/**
 * Test regexp.
 */

/**
 * is.regexp
 * Test if `value` is a regular expression.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if `value` is a regexp, false otherwise
 * @api public
 */

is.regexp = function (value) {
  return '[object RegExp]' === toString.call(value);
};

/**
 * Test string.
 */

/**
 * is.string
 * Test if `value` is a string.
 *
 * @param {Mixed} value value to test
 * @return {Boolean} true if 'value' is a string, false otherwise
 * @api public
 */

is.string = function (value) {
  return '[object String]' === toString.call(value);
};


},{}],4:[function(_dereq_,module,exports){
/**@license MIT-promiscuous-©Ruben Verborgh*/
(function (func, obj) {
  // Type checking utility function
  function is(type, item) { return (typeof item)[0] == type; }

  // Creates a promise, calling callback(resolve, reject), ignoring other parameters.
  function Promise(callback, handler) {
    // The `handler` variable points to the function that will
    // 1) handle a .then(resolved, rejected) call
    // 2) handle a resolve or reject call (if the first argument === `is`)
    // Before 2), `handler` holds a queue of callbacks.
    // After 2), `handler` is a finalized .then handler.
    handler = function pendingHandler(resolved, rejected, value, queue, then, i) {
      queue = pendingHandler.q;

      // Case 1) handle a .then(resolved, rejected) call
      if (resolved != is) {
        return Promise(function (resolve, reject) {
          queue.push({ p: this, r: resolve, j: reject, 1: resolved, 0: rejected });
        });
      }

      // Case 2) handle a resolve or reject call
      // (`resolved` === `is` acts as a sentinel)
      // The actual function signature is
      // .re[ject|solve](<is>, success, value)

      // Check if the value is a promise and try to obtain its `then` method
      if (value && (is(func, value) | is(obj, value))) {
        try { then = value.then; }
        catch (reason) { rejected = 0; value = reason; }
      }
      // If the value is a promise, take over its state
      if (is(func, then)) {
        function valueHandler(resolved) {
          return function (value) { then && (then = 0, pendingHandler(is, resolved, value)); };
        }
        try { then.call(value, valueHandler(1), rejected = valueHandler(0)); }
        catch (reason) { rejected(reason); }
      }
      // The value is not a promise; handle resolve/reject
      else {
        // Replace this handler with a finalized resolved/rejected handler
        handler = function (Resolved, Rejected) {
          // If the Resolved or Rejected parameter is not a function,
          // return the original promise (now stored in the `callback` variable)
          if (!is(func, (Resolved = rejected ? Resolved : Rejected)))
            return callback;
          // Otherwise, return a finalized promise, transforming the value with the function
          return Promise(function (resolve, reject) { finalize(this, resolve, reject, value, Resolved); });
        };
        // Resolve/reject pending callbacks
        i = 0;
        while (i < queue.length) {
          then = queue[i++];
          // If no callback, just resolve/reject the promise
          if (!is(func, resolved = then[rejected]))
            (rejected ? then.r : then.j)(value);
          // Otherwise, resolve/reject the promise with the result of the callback
          else
            finalize(then.p, then.r, then.j, value, resolved);
        }
      }
    };
    // The queue of pending callbacks; garbage-collected when handler is resolved/rejected
    handler.q = [];

    // Create and return the promise (reusing the callback variable)
    callback.call(callback = { then:  function (resolved, rejected) { return handler(resolved, rejected); },
                               catch: function (rejected)           { return handler(0,        rejected); } },
                  function (value)  { handler(is, 1,  value); },
                  function (reason) { handler(is, 0, reason); });
    return callback;
  }

  // Finalizes the promise by resolving/rejecting it with the transformed value
  function finalize(promise, resolve, reject, value, transform) {
    setImmediate(function () {
      try {
        // Transform the value through and check whether it's a promise
        value = transform(value);
        transform = value && (is(obj, value) | is(func, value)) && value.then;
        // Return the result if it's not a promise
        if (!is(func, transform))
          resolve(value);
        // If it's a promise, make sure it's not circular
        else if (value == promise)
          reject(TypeError());
        // Take over the promise's state
        else
          transform.call(value, resolve, reject);
      }
      catch (error) { reject(error); }
    });
  }

  // Export the main module
  module.exports = Promise;

  // Creates a resolved promise
  Promise.resolve = ResolvedPromise;
  function ResolvedPromise(value) { return Promise(function (resolve) { resolve(value); }); }

  // Creates a rejected promise
  Promise.reject = function (reason) { return Promise(function (resolve, reject) { reject(reason); }); };

  // Transforms an array of promises into a promise for an array
  Promise.all = function (promises) {
    return Promise(function (resolve, reject, count, values) {
      // Array of collected values
      values = [];
      // Resolve immediately if there are no promises
      count = promises.length || resolve(values);
      // Transform all elements (`map` is shorter than `forEach`)
      promises.map(function (promise, index) {
        ResolvedPromise(promise).then(
          // Store the value and resolve if it was the last
          function (value) {
            values[index] = value;
            --count || resolve(values);
          },
          // Reject if one element fails
          reject);
      });
    });
  };
})('f', 'o');

},{}],5:[function(_dereq_,module,exports){
var now = _dereq_('performance-now')
  , global = typeof window === 'undefined' ? {} : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = global['request' + suffix]
  , caf = global['cancel' + suffix] || global['cancelRequest' + suffix]

for(var i = 0; i < vendors.length && !raf; i++) {
  raf = global[vendors[i] + 'Request' + suffix]
  caf = global[vendors[i] + 'Cancel' + suffix]
      || global[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for (var i = 0; i < cp.length; i++) {
          if (!cp[i].cancelled) {
            cp[i].callback(last)
          }
        }
      }, next)
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function() {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.apply(global, arguments)
}
module.exports.cancel = function() {
  caf.apply(global, arguments)
}

},{"performance-now":6}],6:[function(_dereq_,module,exports){
(function (process){
// Generated by CoffeeScript 1.6.3
(function() {
  var getNanoSeconds, hrtime, loadTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - loadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    loadTime = getNanoSeconds();
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);

/*
//@ sourceMappingURL=performance-now.map
*/

}).call(this,_dereq_("qhDIRT"))
},{"qhDIRT":15}],7:[function(_dereq_,module,exports){

var easingFn = _dereq_('./motion/easing-functions');
var EventEmitter = _dereq_('events');
var Motion = _dereq_('./motion/instance');
var Promise = _dereq_('promiscuous');
var extend = _dereq_('node.extend');

module.exports = CollideAnimator;

function CollideAnimator(config) {
  var self;
  var eventTypes = [
    'step',
    'pause', 
    'cancel', 
    'play', 
    'complete', //complete callback is passed boolean wasCancelled
    'start', 
    'error'
  ];
  var emitter = new EventEmitter();

  config.step = onMotionStep;
  config.onComplete = onMotionComplete;
  var motion = createMotion(config);

  return self = {
    //Functions
    autoReverse: autoReverse,
    cancel: cancel,
    isPlaying: isPlaying,
    isReverse: isReverse,
    on: onWithTypeCheck(emitter.on),
    once: onWithTypeCheck(emitter.once),
    pause: pause,
    percent: percent,
    play: play,
    promise: promise,
    reverse: reverse,
  };

  function onMotionStep(v) {
    emitter.emit('step', v);
    if ((v === 1 && self.isReverse) || v === 0)  {
      emitter.emit('start');
    }
  }

  function onMotionComplete(didFinish) {
    var wasCancelled = !didFinish;
    emitter.emit('complete', wasCancelled);
  }
  
  function onWithTypeCheck(emitterFn) {
    return function addEventListener(eventType, listener) {
      if (eventTypes.indexOf(eventType) === -1) {
        throw new Error('bad eventType ' + eventType);
      }
      emitterFn.call(emitter, eventType, listener);
      return self;
    };
  }

  function cancel() {
    motion.stop();
    emitter.emit('complete', true);
    emitter.emit('cancel');
    emitter.removeAllListeners();
    return self;
  }

  function isPlaying() {
    return motion.isRunning && !motion.isPaused;
  }
  function isReverse() {
    return motion.reverse;
  }

  function pause() {
    motion.pause();
    emitter.emit('pause');
    return self;
  }
  
  function percent(n) {
    motion.setPercent(n);
    return self;
  }

  function play() {
    if (motion.isPaused) {
      motion.play();
    } else {
      motion.restart();
    }
    emitter.emit('play');
    return self;
  }

  function promise() {
    //On completion: resolve with true
    //On pause: resolve with false 
    //On cancel: reject
    //myAnimator.promise().then(function onStop(wasCompleted) {
    //});
    return new Promise(function(resolve, reject) {
      emitter.on('complete', onComplete);
      emitter.on('pause', onPause);

      function onComplete(wasCancelled) {
        if (wasCancelled) {
          reject();
        } else {
          resolve(true);
        }
        cleanup();
      }
      function onPause() {
        resolve();
        cleanup();
      }
      function cleanup() {
        emitter.removeListener('complete', onComplete);
        emitter.removeListener('pause', onPause);
      }
    });
  }

  function reverse(isReverse) {
    motion.reverse = !!isReverse;
    return self;
  }

  function autoReverse(isAutoReverse) {
    motion.autoReverse = self.autoReverse = !!isAutoReverse;
    return self;
  }
}


function createMotion(opts) {
  if(typeof opts.easing === 'string') {
    tf = easingFn[opts.easing] || easingFn.linear;
    if(opts.easing.indexOf('cubic-bezier(') >= 0) {
      var parts = opts.easing.replace('cubic-bezier(', '').replace(')', '').split(',');
      tf = easingFn['cubic-bezier'];
      tf = tf(parts[0], parts[1], parts[2], parts[3], opts.duration);
    } else {
      tf = tf(opts.duration);
    }
  } else {
    tf = opts.easing;
    tf = tf(opts.duration);
  }

  opts.easingFn = tf;

  if(opts.dynamicsType) {
    opts.dynamic = new opts.dynamicsType(opts);
  }
  return new Motion(opts);
}

},{"./motion/easing-functions":11,"./motion/instance":12,"events":14,"node.extend":1,"promiscuous":4}],8:[function(_dereq_,module,exports){

var Animator = _dereq_('./animator');

module.exports = {
  Animator: Animator,
  dynamics: _dereq_('./motion/dynamics')
};

},{"./animator":7,"./motion/dynamics":10}],9:[function(_dereq_,module,exports){
/*
 * Copyright (C) 2008 Apple Inc. All Rights Reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// http://www.w3.org/TR/css3-transitions/#transition-easing-function
module.exports =  {
  /*
   * @param x {number} the value of x along the bezier curve, 0.0 <= x <= 1.0
   * @param duration {number} the duration of the animation in milliseconds
   * @return {number} the y value along the bezier curve
   */
  linear: unitBezier(0.0, 0.0, 1.0, 1.0),

  /*
   * @param x {number} the value of x along the bezier curve, 0.0 <= x <= 1.0
   * @param duration {number} the duration of the animation in milliseconds
   * @return {number} the y value along the bezier curve
   */
  ease: unitBezier(0.25, 0.1, 0.25, 1.0),

  /*
   * @param x {number} the value of x along the bezier curve, 0.0 <= x <= 1.0
   * @param duration {number} the duration of the animation in milliseconds
   * @return {number} the y value along the bezier curve
   */
  easeIn: unitBezier(0.42, 0, 1.0, 1.0),

  /*
   * @param x {number} the value of x along the bezier curve, 0.0 <= x <= 1.0
   * @param duration {number} the duration of the animation in milliseconds
   * @return {number} the y value along the bezier curve
   */
  easeOut: unitBezier(0, 0, 0.58, 1.0),

  /*
   * @param x {number} the value of x along the bezier curve, 0.0 <= x <= 1.0
   * @param duration {number} the duration of the animation in milliseconds
   * @return {number} the y value along the bezier curve
   */
  easeInOut: unitBezier(0.42, 0, 0.58, 1.0),

  /*
   * @param p1x {number} X component of control point 1
   * @param p1y {number} Y component of control point 1
   * @param p2x {number} X component of control point 2
   * @param p2y {number} Y component of control point 2
   * @param x {number} the value of x along the bezier curve, 0.0 <= x <= 1.0
   * @param duration {number} the duration of the animation in milliseconds
   * @return {number} the y value along the bezier curve
   */
  cubicBezier: function(p1x, p1y, p2x, p2y) {
    return unitBezier(p1x, p1y, p2x, p2y);
  }
};

function B1(t) { return t*t*t; }
function B2(t) { return 3*t*t*(1-t); }
function B3(t) { return 3*t*(1-t)*(1-t); }
function B4(t) { return (1-t)*(1-t)*(1-t); }

/*
 * JavaScript port of Webkit implementation of CSS cubic-bezier(p1x.p1y,p2x,p2y) by http://mck.me
 * http://svn.webkit.org/repository/webkit/trunk/Source/WebCore/platform/graphics/UnitBezier.h
 */

/*
 * Duration value to use when one is not specified (400ms is a common value).
 * @const
 * @type {number}
 */
var DEFAULT_DURATION = 400;//ms

/*
 * The epsilon value we pass to UnitBezier::solve given that the animation is going to run over |dur| seconds.
 * The longer the animation, the more precision we need in the easing function result to avoid ugly discontinuities.
 * http://svn.webkit.org/repository/webkit/trunk/Source/WebCore/page/animation/AnimationBase.cpp
 */
function solveEpsilon(duration) {
  return 1.0 / (200.0 * duration);
}

/*
 * Defines a cubic-bezier curve given the middle two control points.
 * NOTE: first and last control points are implicitly (0,0) and (1,1).
 * @param p1x {number} X component of control point 1
 * @param p1y {number} Y component of control point 1
 * @param p2x {number} X component of control point 2
 * @param p2y {number} Y component of control point 2
 */
function unitBezier(p1x, p1y, p2x, p2y) {

  // private members --------------------------------------------

  // Calculate the polynomial coefficients, implicit first and last control points are (0,0) and (1,1).

  /*
   * X component of Bezier coefficient C
   * @const
   * @type {number}
   */
  var cx = 3.0 * p1x;

  /*
   * X component of Bezier coefficient B
   * @const
   * @type {number}
   */
  var bx = 3.0 * (p2x - p1x) - cx;

  /*
   * X component of Bezier coefficient A
   * @const
   * @type {number}
   */
  var ax = 1.0 - cx -bx;

  /*
   * Y component of Bezier coefficient C
   * @const
   * @type {number}
   */
  var cy = 3.0 * p1y;

  /*
   * Y component of Bezier coefficient B
   * @const
   * @type {number}
   */
  var by = 3.0 * (p2y - p1y) - cy;

  /*
   * Y component of Bezier coefficient A
   * @const
   * @type {number}
   */
  var ay = 1.0 - cy - by;

  /*
   * @param t {number} parametric easing value
   * @return {number}
   */
  var sampleCurveX = function(t) {
    // `ax t^3 + bx t^2 + cx t' expanded using Horner's rule.
    return ((ax * t + bx) * t + cx) * t;
  };

  /*
   * @param t {number} parametric easing value
   * @return {number}
   */
  var sampleCurveY = function(t) {
    return ((ay * t + by) * t + cy) * t;
  };

  /*
   * @param t {number} parametric easing value
   * @return {number}
   */
  var sampleCurveDerivativeX = function(t) {
    return (3.0 * ax * t + 2.0 * bx) * t + cx;
  };

  /*
   * Given an x value, find a parametric value it came from.
   * @param x {number} value of x along the bezier curve, 0.0 <= x <= 1.0
   * @param epsilon {number} accuracy limit of t for the given x
   * @return {number} the t value corresponding to x
   */
  var solveCurveX = function(x, epsilon) {
    var t0;
    var t1;
    var t2;
    var x2;
    var d2;
    var i;

    // First try a few iterations of Newton's method -- normally very fast.
    for (t2 = x, i = 0; i < 8; i++) {
      x2 = sampleCurveX(t2) - x;
      if (Math.abs (x2) < epsilon) {
        return t2;
      }
      d2 = sampleCurveDerivativeX(t2);
      if (Math.abs(d2) < 1e-6) {
        break;
      }
      t2 = t2 - x2 / d2;
    }

    // Fall back to the bisection method for reliability.
    t0 = 0.0;
    t1 = 1.0;
    t2 = x;

    if (t2 < t0) {
      return t0;
    }
    if (t2 > t1) {
      return t1;
    }

    while (t0 < t1) {
      x2 = sampleCurveX(t2);
      if (Math.abs(x2 - x) < epsilon) {
        return t2;
      }
      if (x > x2) {
        t0 = t2;
      } else {
        t1 = t2;
      }
      t2 = (t1 - t0) * 0.5 + t0;
    }

    // Failure.
    return t2;
  };

  /*
   * @param x {number} the value of x along the bezier curve, 0.0 <= x <= 1.0
   * @param epsilon {number} the accuracy of t for the given x
   * @return {number} the y value along the bezier curve
   */
  var solve = function(x, epsilon) {
    return sampleCurveY(solveCurveX(x, epsilon));
  };

  // public interface --------------------------------------------

  /*
   * Find the y of the cubic-bezier for a given x with accuracy determined by the animation duration.
   * @param x {number} the value of x along the bezier curve, 0.0 <= x <= 1.0
   * @param duration {number} the duration of the animation in milliseconds
   * @return {number} the y value along the bezier curve
   */
  return function(x, duration) {
    return solve(x, solveEpsilon(+duration || DEFAULT_DURATION));
  };
}


},{}],10:[function(_dereq_,module,exports){
/**
 * A HUGE thank you to dynamics.js which inspired these dynamics simulations.
 * https://github.com/michaelvillar/dynamics.js
 *
 * Also licensed under MIT
 */

var extend = _dereq_('node.extend');

module.exports = {
  Spring: DynamicsSpring,
  Gravity: DynamicsGravity
};

function DynamicsSpring(opts) {
  var defaults = {
    frequency: 15,
    friction: 200,
    anticipationStrength: 0,
    anticipationSize: 0
  };
  extend(this, defaults);

  var maxs = {
    frequency: 100,
    friction: 1000,
    anticipationStrength: 1000,
    anticipationSize: 99
  };

  var mins = {
    frequency: 0,
    friction: 1,
    anticipationStrength: 0,
    anticipationSize: 0
  };

  extend(this, opts);
}

DynamicsSpring.prototype = {
  at: function(t) {
    var A, At, a, angle, b, decal, frequency, friction, frictionT, s, v, y0, yS,
    _this = this;
    frequency = Math.max(1, this.frequency);
    friction = Math.pow(20, this.friction / 100);
    s = this.anticipationSize / 100;
    decal = Math.max(0, s);
    frictionT = (t / (1 - s)) - (s / (1 - s));
    if (t < s) {
      A = function(t) {
        var M, a, b, x0, x1;
        M = 0.8;
        x0 = s / (1 - s);
        x1 = 0;
        b = (x0 - (M * x1)) / (x0 - x1);
        a = (M - b) / x0;
        return (a * t * _this.anticipationStrength / 100) + b;
      };
      yS = (s / (1 - s)) - (s / (1 - s));
      y0 = (0 / (1 - s)) - (s / (1 - s));
      b = Math.acos(1 / A(yS));
      a = (Math.acos(1 / A(y0)) - b) / (frequency * (-s));
    } else {
      A = function(t) {
        return Math.pow(friction / 10, -t) * (1 - t);
      };
      b = 0;
      a = 1;
    }
    At = A(frictionT);
    angle = frequency * (t - s) * a + b;
    v = 1 - (At * Math.cos(angle));
    //return [t, v, At, frictionT, angle];
    return v;
  }
};

function DynamicsGravity(opts) {
  this.options = {
    bounce: 40,
    gravity: 1000,
    initialForce: false
  };
  extend(this.options, opts);
  this.curves = [];
  this.init();
}

DynamicsGravity.prototype = {
  length: function() {
    var L, b, bounce, curve, gravity;
    bounce = Math.min(this.options.bounce / 100, 80);
    gravity = this.options.gravity / 100;
    b = Math.sqrt(2 / gravity);
    curve = {
      a: -b,
      b: b,
      H: 1
    };
    if (this.options.initialForce) {
      curve.a = 0;
      curve.b = curve.b * 2;
    }
    while (curve.H > 0.001) {
      L = curve.b - curve.a;
      curve = {
        a: curve.b,
        b: curve.b + L * bounce,
        H: curve.H * bounce * bounce
      };
    }
    return curve.b;
  },
  init: function() {
    var L, b, bounce, curve, gravity, _results;

    L = this.length();
    gravity = (this.options.gravity / 100) * L * L;
    bounce = Math.min(this.options.bounce / 100, 80);
    b = Math.sqrt(2 / gravity);
    this.curves = [];
    curve = {
      a: -b,
      b: b,
      H: 1
    };
    if (this.options.initialForce) {
      curve.a = 0;
      curve.b = curve.b * 2;
    }
    this.curves.push(curve);
    _results = [];
    while (curve.b < 1 && curve.H > 0.001) {
      L = curve.b - curve.a;
      curve = {
        a: curve.b,
        b: curve.b + L * bounce,
        H: curve.H * bounce * bounce
      };
      _results.push(this.curves.push(curve));
    }
    return _results;
  },
  curve: function(a, b, H, t){

    var L, c, t2;
    L = b - a;
    t2 = (2 / L) * t - 1 - (a * 2 / L);
    c = t2 * t2 * H - H + 1;
    if (this.initialForce) {
      c = 1 - c;
    }
    return c;
  },
  at: function(t) {
    var bounce, curve, gravity, i, v;
    bounce = this.options.bounce / 100;
    gravity = this.options.gravity;
    i = 0;
    curve = this.curves[i];
    while (!(t >= curve.a && t <= curve.b)) {
      i += 1;
      curve = this.curves[i];
      if (!curve) {
        break;
      }
    }
    if (!curve) {
      v = this.options.initialForce ? 0 : 1;
    } else {
      v = this.curve(curve.a, curve.b, curve.H, t);
    }
    //return [t, v];
    return v;
  }

};

},{"node.extend":1}],11:[function(_dereq_,module,exports){
var dynamics = _dereq_('./dynamics');
var bezier = _dereq_('./bezier');

module.exports = {
  'spring': function(duration) {
    return function(t) {
      return dynamics.Spring(t, duration);
    };
  },
  'gravity': function(duration) {
    return function(t) {
      return dynamics.Gravity(t, duration);
    };
  },
  'linear': function(duration) {
    return function(t) {
      return bezier.linear(t, duration);
    };
  },
  'ease': function(duration) {
    return function(t) {
      return bezier.ease(t, duration);
    };
  },
  'ease-in': function(duration) {
    return function(t) {
      return bezier.easeIn(t, duration);
    };
  },
  'ease-out': function(duration) {
    return function(t) {
      return bezier.easeOut(t, duration);
    };
  },
  'ease-in-out': function(duration) {
    return function(t) {
      return bezier.easeInOut(t, duration);
    };
  },
  'cubic-bezier': function(x1, y1, x2, y2, duration) {
    var bz = bezier.cubicBezier(x1, y1, x2, y2);//, t, duration);
    return function(t) {
      return bz(t, duration);
    };
  }
};

},{"./bezier":9,"./dynamics":10}],12:[function(_dereq_,module,exports){

var extend = _dereq_('node.extend');
var raf = _dereq_('raf');
var motion = _dereq_('./motion');
var easingFn = _dereq_('./easing-functions');

var time = Date.now || function() {
  return +new Date();
};
var desiredFrames = 60;
var millisecondsPerSecond = 1000;
var allowedEvents = [
  'pause', 
  'cancel', 
  'play', 
  'complete', //complete callback is passed boolean didFinish
  'start'
];

function isNumber(value){return typeof value === 'number';}

module.exports = Animation;

function Animation(opts) {
  extend(this, opts);
}

Animation.prototype = {
  clone: function() {
    return new Animation({
      easing: this.easing,
      easingFn: this.easingFn,
      duration: this.duration,
      delay: this.delay,
      repeat: this.repeat,
      reverse: this.reverse,
      autoReverse: this.autoReverse,
      onComplete: this.onComplete,
      step: this.step
    });
  },
  easing: 'linear',
  easingFn: easingFn.linear,
  duration: 500,
  delay: 0,
  repeat: -1,
  reverse: false,
  autoReverse: false,

  onComplete: function(didComplete, droppedFrames) {},

  // Overridable
  step: function(percent) {},

  setPercent: function(percent) {
    var v = this.easingFn(percent);
    this.step(v);

    this._nextStartPercent = percent;
    if (this.isRunning) {
      this.restart();
    }
  },
  stop: function() {
    this.isRunning = false;
    raf.cancel(this._rafId);
    this._runStep && this._runStep();
    this._runStep = null;
  },
  play: function() {
    this.isPaused = false;
    if(this._lastStepFn) {
      this._unpausedAnimation = true;
      raf.cancel(this._rafId);
      this._rafId = raf(this._lastStepFn);
    }
  },
  pause: function() {
    this.isPaused = true;
  },
  _saveState: function(now, closure) {
    this._pauseState = {
      pausedAt: now,
    };
    this._lastStepFn = closure;
    raf.cancel(this._rafId);
  },
  restart: function() {
    this.stop();
    this.start();
  },
  start: function() {
    var self = this;

    var startPercent;
    if (isNumber(this._nextStartPercent)) {
      startPercent = this._nextStartPercent;
      this._nextStartPercent = null;
    } else {
      startPercent = this.reverse === true ? 1 : 0;
    }

    // Set up the initial animation state
    var animState = {
      startPercent: startPercent,
      endPercent: this.reverse === true ? 0 : 1,
      duration: this.duration,
      easingMethod: this.easingFn,
      delay: this.delay,
      reverse: this.reverse,
      repeat: this.repeat,
      autoReverse: this.autoReverse,
      dynamic: this.dynamic
    };
    console.log('starting');

    this.isRunning = true;

    this._runStep = this._run(function(percent, now, render) {
      if(render) {
        self.step(percent);
      }
    }, function(droppedFrames, animationId, finishedAnimation) {
      self.isRunning = false;
      self.onComplete && self.onComplete(finishedAnimation, droppedFrames);
      console.log('Finished anim:', droppedFrames, finishedAnimation);
    }, animState);
  },

  /**
   * Start the animation.
   *
   * @param stepCallback {Function} Pointer to function which is executed on every step.
  *   Signature of the method should be `function(percent, now, virtual) { return continueWithAnimation; }`
   * @param completedCallback {Function}
   *   Signature of the method should be `function(droppedFrames, finishedAnimation) {}`
   * @param duration {Integer} Milliseconds to run the animation
   * @param easingMethod {Function} Pointer to easing function
   *   Signature of the method should be `function(percent) { return modifiedValue; }`
   * @return {Integer} Identifier of animation. Can be used to stop it any time.
   */
  _run: function(stepCallback, completedCallback, state) {
    var self = this;
    var start = time();
    var lastFrame = start;
    var startTime = start + state.delay;
    var percent = state.startPercent;
    var startPercent = state.startPercent;
    var endPercent = state.endPercent;
    var autoReverse = state.autoReverse;
    var delay = state.delay;
    var duration = state.duration;
    var easingMethod = state.easingMethod;
    var repeat = state.repeat;
    var reverse = state.reverse;

    var dropCounter = 0;
    var iteration = 0;

    var perhapsAutoreverse = function() {
      // Check if we hit the end and should auto reverse
      if(percent === endPercent && autoReverse) {
        // Flip the start and end values
        var sp = endPercent;
        reverse = !reverse;
        endPercent = startPercent;
        startPercent = sp;

        if(repeat === 0) {
          autoReverse = false;
        }
      } else {
        // Otherwise, just start over
        percent = startPercent;
      }
      // Start fresh either way
      start = time();
      self._rafId = raf(step);
    };


    // This is the internal step method which is called every few milliseconds
    var step = function(virtual) {
      var now = time();

      if(self._unpausedAnimation) {
        // We unpaused. Increase the start time to account
        // for the gap in playback (to keep timing the same)
        var t = self._pauseState.pausedAt;
        start = start + (now - t);
        lastFrame = now;
      }

      // Normalize virtual value
      var render = virtual !== true;

      // Get current time
      var diff = now - start;

      // Verification is executed before next animation step
      if(self.isPaused) {
        self._saveState(now, step);//percent, iteration, reverse);
        return;
      }

      if (!self.isRunning) {
        completedCallback && completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), self._animationId, false);
        return;
      }


      // For the current rendering to apply let's update omitted steps in memory.
      // This is important to bring internal state variables up-to-date with progress in time.
      if (render) {

        var droppedFrames = Math.round((now - lastFrame) / (millisecondsPerSecond / desiredFrames)) - 1;
        if(self._unpausedAnimation) {
          console.log('After pausing', droppedFrames, 'Dropped frames');
        }
        for (var j = 0; j < Math.min(droppedFrames, 4); j++) {
          console.log('drop step');
          step(true);
          dropCounter++;
        }

      }

      // Compute percent value
      if (diff > delay && duration) {
        percent = startPercent + (diff - delay) / duration;

        // If we are animating in the opposite direction,
        // the percentage is 1 minus this perc val
        if(reverse === true) {
          percent = 1 - percent;
          if (percent < 0) {
            percent = 0;
          }
        } else {
          if (percent > 1) {
            percent = 1;
          }
        }
      }

      self._unpausedAnimation = false;

      // Execute step callback, then...
      var value;
      if(state.dynamic) {
        value = state.dynamic.at(percent);
      } else {
        value = easingMethod ? easingMethod(percent) : percent;
      }
      if ((stepCallback(value, now, render) === false || percent === endPercent) && render) {
        if(repeat === -1) {
          perhapsAutoreverse();
        } else if(iteration < repeat) {
          // Track iterations
          iteration++;
          perhapsAutoreverse();
        } else if(repeat === 0 && autoReverse) {
          perhapsAutoreverse();
        } else {
          completedCallback && completedCallback(
            desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)),
            self._animationId,
            percent === endPercent || duration === null
          );
        }
      } else if (render) {
        lastFrame = now;
        self._rafId = raf(step);
      }
    };


    // Init first step
    self._rafId = raf(step);

    return step;
  }
};

},{"./easing-functions":11,"./motion":13,"node.extend":1,"raf":5}],13:[function(_dereq_,module,exports){

var counter = 1;
var running = {};

/**
 * The main motion system manager. Treated as a singleton.
 */
module.exports = {
  animationStarted: function(instance) {
    var id = counter++;

    // Compacting running db automatically every few new animations
    if (id % 20 === 0) {
      var newRunning = {};
      for (var usedId in running) {
        newRunning[usedId] = true;
      }
      running = newRunning;
    }

    // Mark as running
    running[id] = true;

    instance._animationId = id;

    // Return unique animation ID
    return id;
  },

  animationStopped: function(instance) {
  },

  /* TODO: Move animation set management here instead of instance
  anims: [],
  add: function(animation) {
    this.anims.push(animation);
  },
  remove: function(animation) {
    var i, j;
    for(i = 0, j = this.anims.length; i < j; i++) {
      if(this.anims[i] === animation) {
        return this.anims.splice(i, 1);
      }
    }
  },
  clear: function(shouldStop) {
    while(this.anims.length) {
      var anim = this.anims.pop();
      if(shouldStop === true) {
        anim.stop();
      }
    }
  },
  */

  /**
   * Stops the given animation.
   *
   * @param id {Integer} Unique animation ID
   * @return {Boolean} Whether the animation was stopped (aka, was running before)
   * TODO: Requires above fix
  stop: function(id) {
    var cleared = running[id] != null;
    if (cleared) {
      running[id] = null;
    }

    return cleared;
  },
   */


  /**
   * Whether the given animation is still running.
   *
   * @param id {Integer} Unique animation ID
   * @return {Boolean} Whether the animation is still running
  isRunning: function(id) {
    return running[id] != null;
  },
   */

};

},{}],14:[function(_dereq_,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        throw TypeError('Uncaught, unspecified "error" event.');
      }
      return false;
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],15:[function(_dereq_,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}]},{},[8])
(8)
});