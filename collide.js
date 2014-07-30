!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.collide=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/* jshint node: true */
/* global window: false */
/* global document: false */
'use strict';

// list prefixes and case transforms
// (reverse order as a decrementing for loop is used)
var prefixes = [
  'ms',
  'ms', // intentional: 2nd entry for ms as we will also try Pascal case for MS
  'O',
  'Moz',
  'Webkit',
  ''
];

var caseTransforms = [
  toCamelCase,
  null,
  null,
  toCamelCase,
  null,
  toCamelCase
];

var props = {};
var style;

/**
  ### css(prop)

  Test for the prescence of the specified CSS property (in all it's
  possible browser prefixed variants).  The returned function (if we
  are able to access the required style property) is both a getter and
  setter function for when given an element.

  Consider the following example, with regards to CSS transforms:

  <<< examples/transform.js

**/
module.exports = function(prop) {
  var ii;
  var propName;
  var pascalCaseName;

  style = style || document.body.style;

  // if we already have a value for the target property, return
  if (props[prop] || style[prop]) {
    return props[prop];
  }

  // convert a dash delimited propertyname (e.g. box-shadow) into
  // pascal cased name (e.g. BoxShadow)
  pascalCaseName = prop.split('-').reduce(function(memo, val) {
    return memo + val.charAt(0).toUpperCase() + val.slice(1);
  }, '');

  // check for the property
  for (ii = prefixes.length; ii--; ) {
    propName = prefixes[ii] + (caseTransforms[ii] ?
                  caseTransforms[ii](pascalCaseName) :
                  pascalCaseName);

    if (typeof style[propName] != 'undefined') {
      props[prop] = createGetterSetter(propName);
      break;
    }
  }

  return props[prop];
};

/* internal helper functions */

function createGetterSetter(propName) {
  function gs(element, value) {
    // if we have a value update
    if (typeof value != 'undefined') {
      element.style[propName] = value;
    }

    return window.getComputedStyle(element)[propName];
  }

  // attach the property name to the getter and setter
  gs.property = propName;
  return gs;
}

function toCamelCase(input) {
  return input.charAt(0).toLowerCase() + input.slice(1);
}
},{}],2:[function(_dereq_,module,exports){
module.exports = _dereq_('./lib/extend');


},{"./lib/extend":3}],3:[function(_dereq_,module,exports){
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


},{"is":4}],4:[function(_dereq_,module,exports){

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
},{"qhDIRT":20}],7:[function(_dereq_,module,exports){

var extend = _dereq_('node.extend');
var EventEmitter = _dereq_('events');
var cssFeature = _dereq_('feature/css');

var timeline = _dereq_('./core/timeline');
var dynamics = _dereq_('./core/dynamics');
var interpolate = _dereq_('./core/interpolate');
var easingFunctions = _dereq_('./core/easing-functions');
var uid = _dereq_('./util/uid');

function clamp(min, n, max) { return Math.max(min, Math.min(n, max)); }
function isString(value){return typeof value === 'string';}
function isNumber(value){return typeof value === 'number';}

module.exports = Animator;

function Animator(opts) {
  //if `new` keyword isn't provided, do it for user
  if (!(this instanceof Animator)) {
    return new Animator(opts);
  }

  opts = opts || {};

  //Everything private goes in `this._`
  this._ = {
    id: uid(),
    percent: 0,
    duration: 500,
    iterations: 1,
    direction: {
      reverse: false,
      alternate: false
    }
  };

  opts.duration && this.duration(opts.duration);
  opts.percent && this.percent(opts.percent);
  opts.easing && this.easing(opts.easing);
  opts.iterations && this.iterations(opts.iterations);
  opts.direction && this.direction(opts.direction);

  var emitter = this._.emitter = new EventEmitter();
  this._.onDestroy = function() {
    emitter.emit('destroy');
  };
  this._.onStop = function(wasCompleted) {
    emitter.emit('stop', wasCompleted);
  };
  this._.onStart = function() {
    emitter.emit('start');
  };
  this._.onStep = function(v) {
    emitter.emit('step', v);
  };
}

Animator.prototype = {

  direction: function(direction) {
    if (arguments.length && isString(direction)) {
      this._.direction = figureOutDirection(direction);
    }
    return this._.direction;
  },

  iterations: function(iterations) {
    if (arguments.length && isNumber(iterations)) {
      this._.iterations = iterations;
    }
    return this._.iterations;
  },

  easing: function(easing) {
    var type = typeof easing;
    if (arguments.length &&
        (type === 'function' || type === 'string' || type === 'object')) {
      this._.easing = figureOutEasing(easing);
    }
    return this._.easing;
  },

  percent: function(percent) {
    if (arguments.length && isNumber(percent)) {
      this._.percent = clamp(0, percent, 1);

      if (!this._.isRunning) {
        this._.onStep(this._getValueForPercent(this._.percent));
      }
    }
    return this._.percent;
  },

  duration: function(duration) {
    if (arguments.length && isNumber(duration)) {
      this._.duration = Math.max(1, duration);
    }
    return this._.duration;
  },

  addInterpolation: function(el, startingStyles, endingStyles) {
    var interpolators;
    if (arguments.length) {
      syncStyles(startingStyles, endingStyles, window.getComputedStyle(el));
      interpolators = makePropertyInterpolators(startingStyles, endingStyles);

      this.on('step', setStyles);
      return function unbind() {
        this.removeListener('step', setStyles);
      };
    }
    function setStyles(v) {
      for (var property in interpolators) {
        el.style[property] = interpolators[property](v);
      }
    }
  },

  isRunning: function() { 
    return !!this._.isRunning; 
  },

  on: function(eventType, listener) {
    this._.emitter.on(eventType, listener);
    return this;
  },
  once: function(eventType, listener) {
    this._.emitter.once(eventType, listener);
    return this;
  },
  removeListener: function(eventType, listener) {
    this._.emitter.removeListener(eventType, listener);
    return this;
  },
  removeAllListeners: function() {
    this._.emitter.removeAllListeners();
    return this;
  },

  destroy: function() {
    this.stop();
    this.onDestroy();
    this._.emitter.removeAllListeners();
    return this;
  },

  stop: function() {
    if (!this._.isRunning) return;

    this._.isRunning = false;
    timeline.animationStopped(this);

    this._.onStop(this._isComplete());
    return this;
  },

  start: function(shouldRenderImmediately) {
    if (this._.isRunning) return;

    //If we're done, start animation over
    if (this._isComplete()) {
      this._.percent = this._getStartPercent();
      this._.iterationsRemaining = this._.iterations;
    }

    if (shouldRenderImmediately) {
      this._.onStep(this._getValueForPercent(this._.percent));
      this._.noProgressionFirstTick = false;
    } else {
      // Otherwise, the first tick makes no progress
      this._.noProgressionFirstTick = true;
    }

    this._.isRunning = true;
    timeline.animationStarted(this);

    this._.onStart();
    return this;
  },

  _isComplete: function() {
    return !this._.isRunning && 
      this._.percent === this._getEndPercent() &&
      !this._.iterationsRemaining;
  },
  _getEndPercent: function() {
    return this._.direction.reverse ? 0 : 1;
  },
  _getStartPercent: function() {
    return this._.direction.reverse ? 1 : 0;
  },

  _getValueForPercent: function(percent) {
    if (this._.easing) {
      return this._.easing(percent, this._.duration);
    }
    return percent;
  },

  _tick: function(deltaT) {
    var state = this._;

    if (state.noProgressionFirstTick) {
      //On first tick, do not change the percent
      state.noProgressionFirstTick = false;
    } else if (state.direction.reverse) {
      state.percent = Math.max(0, state.percent - (deltaT / state.duration));
    } else {
      state.percent = Math.min(1, state.percent + (deltaT / state.duration));
    }

    state.onStep(this._getValueForPercent(state.percent));

    if (state.percent === this._getEndPercent()) {
      state.iterationsRemaining = Math.max(state.iterationsRemaining - 1, 0);
      //Repeat if needed
      if (state.iterationsRemaining) {
        if (state.direction.alternate) {
          state.direction.reverse = !state.direction.reverse;
        }
        state.percent = this._getStartPercent();
      } else {
        this.stop();
      }
    }
  },
};

function figureOutEasing(easing) {
  if (typeof easing === 'object') {
    var dynamicType = isString(easing.type) && easing.type.toLowerCase().trim();

    if (!dynamics[dynamicType]) {
      throw new Error(
        'Invalid easing dynamics object type "' + easing.type + '". ' +
        'Available dynamics types: ' + Object.keys(dynamics).join(', ') + '.'
      );
    }
    return dynamics[dynamicType](easing);

  } else if (typeof easing === 'string') {
    easing = easing.toLowerCase().trim();
    
    if (easing.indexOf('cubic-bezier(') === 0) {
      var parts = easing
        .replace('cubic-bezier(', '')
        .replace(')', '')
        .split(',')
        .map(function(v) {
          return v.trim();
        });
      return easingFunctions['cubic-bezier'](parts[0], parts[1], parts[2], parts[3]);
    } else {
      var fn = easingFunctions[easing];
      if (!fn) {
        throw new Error(
          'Invalid easing function "' + easing + '". ' +
          'Available easing functions: ' + Object.keys(easingFunctions).join(', ') + '.'
        );
      }
      return easingFunctions[easing]();
    }
  } else if (typeof easing === 'function') {
    return easing;
  }
}

function figureOutDirection(direction) {
  direction = direction.trim().toLowerCase();
  if (/normal|reverse|alternate|alternate-?reverse/.test(direction)) {
    return {
      alternate: direction.indexOf('alternate') !== -1,
      reverse: direction.indexOf('reverse') !== -1
    };
  } else {
    throw new Error(
      'Invalid direction "' + opts.direction + '". ' +
      'Available directions: normal, reverse, alternate, alternate-reverse'
    );
  }
}

/*
 * Tweening helpers
 */
function syncStyles(startingStyles, endingStyles, computedStyle) {
  var property;
  for (property in startingStyles) {
    if (!endingStyles.hasOwnProperty(property)) {
      delete startingStyles[property];
    }
  }
  for (property in endingStyles) {
    if (!startingStyles.hasOwnProperty(property)) {
      startingStyles[property] = computedStyle[vendorizePropertyName(property)];
    }
  }
}

function makePropertyInterpolators(startingStyles, endingStyles) {
  var interpolators = {};
  var property;
  for (property in startingStyles) {
    interpolators[vendorizePropertyName(property)] = interpolate.propertyInterpolator(
      property, startingStyles[property], endingStyles[property]
    );
  }
  return interpolators;
}

var transformProperty;
function vendorizePropertyName(property) {
  if (property === 'transform') {
    //Set transformProperty lazily, to be sure DOM has loaded already when using it
    return transformProperty || 
      (transformProperty = cssFeature('transform').property);
  } else {
    return property;
  }
}

},{"./core/dynamics":9,"./core/easing-functions":10,"./core/interpolate":13,"./core/timeline":16,"./util/uid":18,"events":19,"feature/css":1,"node.extend":2}],8:[function(_dereq_,module,exports){
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


},{}],9:[function(_dereq_,module,exports){
/**
 * A HUGE thank you to dynamics.js which inspired these dynamics simulations.
 * https://github.com/michaelvillar/dynamics.js
 *
 * Also licensed under MIT
 */

var extend = _dereq_('node.extend');

module.exports = {
  spring: dynamicsSpring,
  gravity: dynamicsGravity
};

var springDefaults = {
  frequency: 15,
  friction: 200,
  anticipationStrength: 0,
  anticipationSize: 0
};
function dynamicsSpring(opts) {
  opts = extend({}, springDefaults, opts);

  return function at(t, duration) {
    var A, At, a, angle, b, decal, frequency, friction, frictionT, s, v, y0, yS,
    _opts = opts;
    frequency = Math.max(1, opts.frequency);
    friction = Math.pow(20, opts.friction / 100);
    s = opts.anticipationSize / 100;
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
        return (a * t * _opts.anticipationStrength / 100) + b;
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
  };
}

var gravityDefaults = {
  bounce: 40,
  gravity: 1000,
  initialForce: false
};
function dynamicsGravity(opts) {
  opts = extend({}, gravityDefaults, opts);
  var curves = [];

  init();

  return at;

  function length() {
    var L, b, bounce, curve, gravity;
    bounce = Math.min(opts.bounce / 100, 80);
    gravity = opts.gravity / 100;
    b = Math.sqrt(2 / gravity);
    curve = {
      a: -b,
      b: b,
      H: 1
    };
    if (opts.initialForce) {
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
  }

  function init() {
    var L, b, bounce, curve, gravity, _results;

    L = length();
    gravity = (opts.gravity / 100) * L * L;
    bounce = Math.min(opts.bounce / 100, 80);
    b = Math.sqrt(2 / gravity);
    curves = [];
    curve = {
      a: -b,
      b: b,
      H: 1
    };
    if (opts.initialForce) {
      curve.a = 0;
      curve.b = curve.b * 2;
    }
    curves.push(curve);
    _results = [];
    while (curve.b < 1 && curve.H > 0.001) {
      L = curve.b - curve.a;
      curve = {
        a: curve.b,
        b: curve.b + L * bounce,
        H: curve.H * bounce * bounce
      };
      _results.push(curves.push(curve));
    }
    return _results;
  }

  function calculateCurve(a, b, H, t){
    var L, c, t2;
    L = b - a;
    t2 = (2 / L) * t - 1 - (a * 2 / L);
    c = t2 * t2 * H - H + 1;
    if (opts.initialForce) {
      c = 1 - c;
    }
    return c;
  }

  function at(t, duration) {
    var bounce, curve, gravity, i, v;
    bounce = opts.bounce / 100;
    gravity = opts.gravity;
    i = 0;
    curve = curves[i];
    while (!(t >= curve.a && t <= curve.b)) {
      i += 1;
      curve = curves[i];
      if (!curve) {
        break;
      }
    }
    if (!curve) {
      v = opts.initialForce ? 0 : 1;
    } else {
      v = calculateCurve(curve.a, curve.b, curve.H, t);
    }
    //return [t, v];
    return v;
  }

};

},{"node.extend":2}],10:[function(_dereq_,module,exports){
var dynamics = _dereq_('./dynamics');
var bezier = _dereq_('./bezier');

module.exports = {
  'linear': function() {
    return function(t, duration) {
      return bezier.linear(t, duration);
    };
  },
  'ease': function() {
    return function(t, duration) {
      return bezier.ease(t, duration);
    };
  },
  'ease-in': function() {
    return function(t, duration) {
      return bezier.easeIn(t, duration);
    };
  },
  'ease-out': function() {
    return function(t, duration) {
      return bezier.easeOut(t, duration);
    };
  },
  'ease-in-out': function() {
    return function(t, duration) {
      return bezier.easeInOut(t, duration);
    };
  },
  'cubic-bezier': function(x1, y1, x2, y2, duration) {
    var bz = bezier.cubicBezier(x1, y1, x2, y2);//, t, duration);
    return function(t, duration) {
      return bz(t, duration);
    };
  }
};

},{"./bezier":8,"./dynamics":9}],11:[function(_dereq_,module,exports){
/**
 * Modified version of web-animations color-handler.js
 */

// Copyright 2014 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
// limitations under the License.

var numberHandler = _dereq_('./number-handler');

module.exports = {
  parseColor: parseColor,
  mergeColors: mergeColors
};

var canvas = document.createElement('canvas');
canvas.width = canvas.height = 1;
var context = canvas.getContext('2d');

function parseColor(string) {
  string = string.trim();
  // The context ignores invalid colors
  context.fillStyle = '#000';
  context.fillStyle = string;
  var contextSerializedFillStyle = context.fillStyle;
  context.fillStyle = '#fff';
  context.fillStyle = string;
  if (contextSerializedFillStyle != context.fillStyle)
    return;
  context.fillRect(0, 0, 1, 1);
  var pixelColor = context.getImageData(0, 0, 1, 1).data;
  context.clearRect(0, 0, 1, 1);
  var alpha = pixelColor[3] / 255;
  return [pixelColor[0] * alpha, pixelColor[1] * alpha, pixelColor[2] * alpha, alpha];
}

function mergeColors(left, right) {
  return [left, right, function(x) {
    function clamp(v) {
      return Math.max(0, Math.min(255, v));
    }
    if (x[3]) {
      for (var i = 0; i < 3; i++)
        x[i] = Math.round(clamp(x[i] / x[3]));
    }
    x[3] = numberHandler.numberToString(clamp(x[3]));
    return 'rgba(' + x.join(',') + ')';
  }];
}


},{"./number-handler":14}],12:[function(_dereq_,module,exports){

/**
 * Modified version of web-animations dimension-handler
 */

// Copyright 2014 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
// limitations under the License.

var numberHandler = _dereq_('./number-handler');

var lengthUnits = 'px|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc';
var parseLength = parseDimension.bind(null, new RegExp(lengthUnits, 'g'));
var parseLengthOrPercent = parseDimension.bind(null, new RegExp(lengthUnits + '|%', 'g'));
var parseAngle = parseDimension.bind(null, /deg|rad|grad|turn/g);

module.exports = {
  parseLength: parseLength,
  parseLengthOrPercent: parseLengthOrPercent,
  parseAngle: parseAngle,
  mergeDimensions: mergeDimensions
};

function parseDimension(unitRegExp, string) {
  string = string.trim().toLowerCase();

  if (string == '0' && 'px'.search(unitRegExp) >= 0)
    return {px: 0};

  // If we have parenthesis, we're a calc and need to start with 'calc'.
  if (!/^[^(]*$|^calc/.test(string))
    return;

  string = string.replace(/calc\(/g, '(');

  // We tag units by prefixing them with 'U' (note that we are already
  // lowercase) to prevent problems with types which are substrings of
  // each other (although prefixes may be problematic!)
  var matchedUnits = {};
  string = string.replace(unitRegExp, function(match) {
    matchedUnits[match] = null;
    return 'U' + match;
  });
  var taggedUnitRegExp = 'U(' + unitRegExp.source + ')';

  // Validating input is simply applying as many reductions as we can.
  var typeCheck = string.replace(/[-+]?(\d*\.)?\d+/g, 'N')
  .replace(new RegExp('N' + taggedUnitRegExp, 'g'), 'D')
  .replace(/\s[+-]\s/g, 'O')
  .replace(/\s/g, '');
  var reductions = [/N\*(D)/g, /(N|D)[*/]N/g, /(N|D)O\1/g, /\((N|D)\)/g];
  var i = 0;
  while (i < reductions.length) {
    if (reductions[i].test(typeCheck)) {
      typeCheck = typeCheck.replace(reductions[i], '$1');
      i = 0;
    } else {
      i++;
    }
  }
  if (typeCheck != 'D')
    return;

  for (var unit in matchedUnits) {
    var result = eval(string.replace(new RegExp('U' + unit, 'g'), '').replace(new RegExp(taggedUnitRegExp, 'g'), '*0'));
    if (!isFinite(result))
      return;
    matchedUnits[unit] = result;
  }
  return matchedUnits;
}

function mergeDimensions(left, right) {
  var units = [], unit;
  for (unit in left)
    units.push(unit);
  for (unit in right) {
    if (units.indexOf(unit) < 0)
      units.push(unit);
  }

  left = units.map(function(unit) { return left[unit] || 0; });
  right = units.map(function(unit) { return right[unit] || 0; });
  return [left, right, function(values) {
    var result = values.map(function(value, i) {
      // Scientific notation (e.g. 1e2) is not yet widely supported by browser vendors.
      return numberHandler.numberToString(value) + units[i];
    }).join(' + ');
    return values.length > 1 ? 'calc(' + result + ')' : result;
  }];
}



},{"./number-handler":14}],13:[function(_dereq_,module,exports){
/**
 * Modified version of web-animations interpolate.js
 */

// Copyright 2014 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
// limitations under the License.


var colorHandler = _dereq_('./color-handler');
var dimensionHandler = _dereq_('./dimension-handler');
var numberHandler = _dereq_('./number-handler');
var transformHandler = _dereq_('./transform-handler');

var propertyHandlers = {};

module.exports = {
  propertyInterpolator: propertyInterpolator
};

//Handler to tween colors
addPropertiesHandler(
  colorHandler.parseColor, 
  colorHandler.mergeColors, 
  ['color', 'backgroundColor']
);

//Handler to tween dimensions
addPropertiesHandler(
  dimensionHandler.parseLengthOrPercent, 
  dimensionHandler.mergeDimensions, 
  ['left', 'right', 'top', 'bottom', 'width', 'height', 'border-width']
);

// Handler to tween opacity and keep it between 0/1
addPropertiesHandler(
  numberHandler.parseNumber, 
  numberHandler.clampedMergeNumbers(0, 1), 
  ['opacity']
);

// Handler to tween any transform value
addPropertiesHandler(
  transformHandler.parseTransform,
  transformHandler.mergeTransforms,
  ['transform']
);


function addPropertiesHandler(parser, merger, properties) {
  for (var i = 0; i < properties.length; i++) {
    var property = properties[i];
    propertyHandlers[property] = propertyHandlers[property] || [];
    propertyHandlers[property].push([parser, merger]);
  }
}

function propertyInterpolator(property, left, right) {
  var handlers = left == right ? [] : propertyHandlers[property];
  for (var i = 0; handlers && i < handlers.length; i++) {
    var parsedLeft = handlers[i][0](left);
    var parsedRight = handlers[i][0](right);
    if (parsedLeft !== undefined && parsedRight !== undefined) {
      var interpolationArgs = handlers[i][1](parsedLeft, parsedRight);
      if (interpolationArgs)
        return makeInterpolator.apply(null, interpolationArgs);
    }
  }
  return makeInterpolator(false, true, function(bool) {
    return bool ? right : left;
  });
}

function makeInterpolator(from, to, convertToString) {
  return function(f) {
    return convertToString(interpolate(from, to, f));
  };
}

function interpolate(from, to, f) {
  if ((typeof from == 'number') && (typeof to == 'number')) {
    return from * (1 - f) + to * f;
  }
  if ((typeof from == 'boolean') && (typeof to == 'boolean')) {
    return f < 0.5 ? from : to;
  }
  if (from.length == to.length) {
    var r = [];
    for (var i = 0; i < from.length; i++) {
      r.push(interpolate(from[i], to[i], f));
    }
    return r;
  }
  throw 'Mismatched interpolation arguments ' + from + ':' + to;
}

},{"./color-handler":11,"./dimension-handler":12,"./number-handler":14,"./transform-handler":15}],14:[function(_dereq_,module,exports){
/**
 * Modified version of web-animations number-handler.js
 */

// Copyright 2014 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
// limitations under the License.

module.exports = {
  parseNumber: parseNumber,
  mergeNumbers: mergeNumbers,
  numberToString: numberToString,
  clampedMergeNumbers: clampedMergeNumbers
};

function numberToString(x) {
  return x.toFixed(3).replace('.000', '');
}

function clamp(min, max, x) {
  return Math.min(max, Math.max(min, x));
}

function parseNumber(string) {
  if (/^\s*[-+]?(\d*\.)?\d+\s*$/.test(string))
    return Number(string);
}

function mergeNumbers(left, right) {
  return [left, right, numberToString];
}

function clampedMergeNumbers(min, max) {
  return function(left, right) {
    return [left, right, function(x) {
      return numberToString(clamp(min, max, x));
    }];
  };
}

},{}],15:[function(_dereq_,module,exports){
/**
 * Modified version of web-animations transform-handler.js
 */

// Copyright 2014 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
// limitations under the License.

var colorHandler = _dereq_('./color-handler');
var dimensionHandler = _dereq_('./dimension-handler');
var numberHandler = _dereq_('./number-handler');

module.exports = {
  parseTransform: parseTransform,
  mergeTransforms: mergeTransforms
};

var _ = null;
function cast(pattern) {
  return function(contents) {
    var i = 0;
    return pattern.map(function(x) { return x === _ ? contents[i++] : x; });
  };
}

function id(x) { return x; }

var pxZero = {px: 0};
var degZero = {deg: 0};

// FIXME: We should support matrix, matrix3d, perspective and rotate3d

// type: [argTypes, convertTo3D, convertTo2D]
// In the argument types string, lowercase characters represent optional arguments
var transformFunctions = {
  rotate: ['A'],
  rotatex: ['A'],
  rotatey: ['A'],
  rotatez: ['A'],
  scale: ['Nn', cast([_, _, 1]), id],
  scalex: ['N', cast([_, 1, 1]), cast([_, 1])],
  scaley: ['N', cast([1, _, 1]), cast([1, _])],
  scalez: ['N', cast([1, 1, _])],
  scale3d: ['NNN', id],
  skew: ['Aa', null, id],
  skewx: ['A', null, cast([_, degZero])],
  skewy: ['A', null, cast([degZero, _])],
  translate: ['Tt', cast([_, _, pxZero]), id],
  translatex: ['T', cast([_, pxZero, pxZero]), cast([_, pxZero])],
  translatey: ['T', cast([pxZero, _, pxZero]), cast([pxZero, _])],
  translatez: ['L', cast([pxZero, pxZero, _])],
  translate3d: ['TTL', id],
};

function parseTransform(string) {
  string = string.toLowerCase().trim();
  if (string == 'none')
    return [];
  // FIXME: Using a RegExp means calcs won't work here
  var transformRegExp = /\s*(\w+)\(([^)]*)\)/g;
  var result = [];
  var match;
  var prevLastIndex = 0;
  while (match = transformRegExp.exec(string)) {
    if (match.index != prevLastIndex)
      return;
    prevLastIndex = match.index + match[0].length;
    var functionName = match[1];
    var functionData = transformFunctions[functionName];
    if (!functionData)
      return;

    var args = match[2].split(',');
    var argTypes = functionData[0];
    if (argTypes.length < args.length)
      return;

    var parsedArgs = [];
    for (var i = 0; i < argTypes.length; i++) {
      var arg = args[i];
      var type = argTypes[i];
      var parsedArg;
      if (!arg)
        parsedArg = ({a: degZero,
                      n: parsedArgs[0],
                      t: pxZero})[type];
      else
        parsedArg = ({A: function(s) { return s.trim() == '0' ? degZero : dimensionHandler.parseAngle(s); },
                      N: numberHandler.parseNumber,
                      T: dimensionHandler.parseLengthOrPercent,
                      L: dimensionHandler.parseLength})[type.toUpperCase()](arg);
      if (parsedArg === undefined)
        return;
      parsedArgs.push(parsedArg);
    }
    result.push([functionName, parsedArgs]);

    if (transformRegExp.lastIndex == string.length)
      return result;
  }
};

function typeTo2D(type) {
  return type.replace(/[xy]/, '');
}

function typeTo3D(type) {
  return type.replace(/(x|y|z|3d)?$/, '3d');
}

function mergeTransforms(left, right) {
  // FIXME: We should add optional matrix interpolation support for the early return cases
  var flipResults = false;
  if (!left.length || !right.length) {
    if (!left.length) {
      flipResults = true;
      left = right;
      right = [];
    }
    for (var i = 0; i < left.length; i++) {
      var type = left[i][0];
      var args = left[i][1];
      var defaultValue = type.substr(0, 5) == 'scale' ? 1 : 0;
      right.push([type, args.map(function(arg) {
        if (typeof arg == 'number')
          return defaultValue;
        var result = {};
        for (var unit in arg)
          result[unit] = defaultValue;
        return result;
      })]);
    }
  }

  if (left.length != right.length)
    return;
  var leftResult = [];
  var rightResult = [];
  var types = [];
  for (var i = 0; i < left.length; i++) {
    var leftType = left[i][0];
    var rightType = right[i][0];
    var leftArgs = left[i][1];
    var rightArgs = right[i][1];

    var leftFunctionData = transformFunctions[leftType];
    var rightFunctionData = transformFunctions[rightType];

    var type;
    if (leftType == rightType) {
      type = leftType;
    } else if (leftFunctionData[2] && rightFunctionData[2] && typeTo2D(leftType) == typeTo2D(rightType)) {
      type = typeTo2D(leftType);
      leftArgs = leftFunctionData[2](leftArgs);
      rightArgs = rightFunctionData[2](rightArgs);
    } else if (leftFunctionData[1] && rightFunctionData[1] && typeTo3D(leftType) == typeTo3D(rightType)) {
      type = typeTo3D(leftType);
      leftArgs = leftFunctionData[1](leftArgs);
      rightArgs = rightFunctionData[1](rightArgs);
    } else {
      return;
    }

    var stringConversions = [];
    for (var j = 0; j < leftArgs.length; j++) {
      var merge = typeof leftArgs[j] == 'number' ? numberHandler.mergeNumbers : dimensionHandler.mergeDimensions;
      var merged = merge(leftArgs[j], rightArgs[j]);
      leftArgs[j] = merged[0];
      rightArgs[j] = merged[1];
      stringConversions.push(merged[2]);
    }
    leftResult.push(leftArgs);
    rightResult.push(rightArgs);
    types.push([type, stringConversions]);
  }

  if (flipResults) {
    var tmp = leftResult;
    leftResult = rightResult;
    rightResult = tmp;
  }

  return [leftResult, rightResult, function(list) {
    return list.map(function(args, i) {
      var stringifiedArgs = args.map(function(arg, j) {
        return types[i][1][j](arg);
      }).join(',');
      return types[i][0] + '(' + stringifiedArgs + ')';
    }).join(' ');
  }];
}



},{"./color-handler":11,"./dimension-handler":12,"./number-handler":14}],16:[function(_dereq_,module,exports){

var raf = _dereq_('raf');
var running = {};

var self = module.exports = {

  animationStarted: function(instance) {
    running[instance._.id] = instance;

    if (!self.isTicking) {
      self.tick();
    }
  },

  animationStopped: function(instance) {
    delete running[instance._.id];
    self.maybeStopTicking();
  },

  tick: function() {
    var lastFrame = performance.now();

    self.isTicking = true;
    self._rafId = raf(step);

    function step() {
      self._rafId = raf(step);

      // Get current time
      var now = performance.now();
      var deltaT = now - lastFrame;

      for (var animationId in running) {
        running[animationId]._tick(deltaT);
      }

      lastFrame = now;
    }
  },

  maybeStopTicking: function() {
    if (self.isTicking && !Object.keys(running).length) {
      raf.cancel(self._rafId);
      self.isTicking = false;
    }
  },

};


},{"raf":5}],17:[function(_dereq_,module,exports){
module.exports = {
  animator: _dereq_('./animator')
};

},{"./animator":7}],18:[function(_dereq_,module,exports){

/**
 * nextUid() from angular.js
 * License MIT
 * http://github.com/angular/angular.js
 *
 * A consistent way of creating unique IDs in angular. The ID is a sequence of alpha numeric
 * characters such as '012ABC'. The reason why we are not using simply a number counter is that
 * the number string gets longer over time, and it can also overflow, where as the nextId
 * will grow much slower, it is a string, and it will never overflow.
 *
 * @returns an unique alpha-numeric string
 */
var uid = [];

module.exports = function nextUid() {
  var index = uid.length;
  var digit;

  while(index) {
    index--;
    digit = uid[index].charCodeAt(0);
    if (digit == 57 /*'9'*/) {
      uid[index] = 'A';
      return uid.join('');
    }
    if (digit == 90  /*'Z'*/) {
      uid[index] = '0';
    } else {
      uid[index] = String.fromCharCode(digit + 1);
      return uid.join('');
    }
  }
  uid.unshift('0');
  return uid.join('');
};

},{}],19:[function(_dereq_,module,exports){
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

},{}],20:[function(_dereq_,module,exports){
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

},{}]},{},[17])
(17)
});