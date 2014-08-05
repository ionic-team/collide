
var cssFeature = require('feature/css');

var timeline = require('./core/timeline');
var dynamics = require('./core/dynamics');
var interpolate = require('./core/interpolate');
var easingFunctions = require('./core/easing-functions');

var uid = require('./util/uid');
var EventEmitter = require('./util/simple-emitter');

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

  //Private state goes in this._
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
    wasCompleted && emitter.emit('complete');
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
      return this;
    }
    return this._.direction;
  },

  iterations: function(iterations) {
    if (arguments.length && isNumber(iterations)) {
      this._.iterations = iterations;
      return this;
    }
    return this._.iterations;
  },

  easing: function(easing) {
    var type = typeof easing;
    if (arguments.length &&
        (type === 'function' || type === 'string' || type === 'object')) {
      this._.easing = figureOutEasing(easing);
      return this;
    }
    return this._.easing;
  },

  percent: function(percent) {
    if (arguments.length && isNumber(percent)) {
      this._.percent = clamp(0, percent, 1);

      if (!this._.isRunning) {
        this._.onStep(this._getValueForPercent(this._.percent));
      }
      return this;
    }
    return this._.percent;
  },

  duration: function(duration) {
    if (arguments.length && isNumber(duration)) {
      this._.duration = Math.max(1, duration);
      return this;
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
        this.off('step', setStyles);
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

  promise: function() {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.once('stop', resolve);
    });
  },

  on: function(eventType, listener) {
    this._.emitter.on(eventType, listener);
    return this;
  },
  once: function(eventType, listener) {
    this._.emitter.once(eventType, listener);
    return this;
  },
  off: function(eventType, listener) {
    this._.emitter.off(eventType, listener);
    return this;
  },

  destroy: function() {
    this.stop();
    this._.onDestroy();
    this._.emitter.off();
    return this;
  },

  stop: function() {
    if (!this._.isRunning) return;

    this._.isRunning = false;
    timeline.animationStopped(this);

    this._.onStop(this._isComplete());
    return this;
  },

  start: function() {
    if (this._.isRunning) return;

    //If we're done, start animation over
    if (this._isComplete()) {
      this._.percent = this._getStartPercent();
      this._.iterationsRemaining = this._.iterations;
    }

    // Otherwise, the first tick makes no progress
    this._.noProgressionFirstTick = true;

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
