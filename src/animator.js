
// Interpolation disabled for now
// var interpolate = require('./core/interpolate');
// var cssFeature = require('feature/css');

var timeline = require('./core/timeline');
var dynamics = require('./core/dynamics');
var easingFunctions = require('./core/easing-functions');

var uid = require('./util/uid');
var EventEmitter = require('./util/simple-emitter');

function clamp(min, n, max) { return Math.max(min, Math.min(n, max)); }

module.exports = Animator;

function Animator(opts) {
  //if `new` keyword isn't provided, do it for user
  if (!(this instanceof Animator)) {
    return new Animator(opts);
  }
  var self = this;


  opts = opts || {};

  //Private state goes in this._
  this._ = {
    id: uid(),
    percent: 0,
    duration: 500,
    isReverse: false
  };

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

  var precision = 10000;
  this._.onStep = function(v) {
    emitter.emit('step', Math.round(v * precision) / precision);
  };

  opts.duration && this.duration(opts.duration);
  opts.percent && this.percent(opts.percent);
  opts.easing && this.easing(opts.easing);
  opts.reverse && this.reverse(opts.reverse);
  
  //Put this here so we don't have to call _tick in the context of our object.
  //Avoids having to use .bind() or .call() every frame.
  self._tick = function(deltaT) {
    var state = self._;

    //First tick, don't up the percent
    if (state.isStarting) {
      state.isStarting = false;
    } else if (state.isReverse) {
      state.percent = Math.max(0, state.percent - (deltaT / state.duration));
    } else {
      state.percent = Math.min(1, state.percent + (deltaT / state.duration));
    }
    
    state.onStep(self._getValueForPercent(state.percent));

    if (state.percent === self._getEndPercent()) {
      self.stop();
    }
  };

}

Animator.prototype = {

  reverse: function(reverse) {
    if (arguments.length) {
      this._.isReverse = !!reverse;
      return this;
    }
    return this._.isReverse;
  },

  easing: function(easing) {
    var type = typeof easing;
    if (arguments.length) {
      if (type === 'function' || type === 'string' || type === 'object') {
        this._.easing = figureOutEasing(easing);
      }
      return this;
    }
    return this._.easing;
  },

  percent: function(percent, immediate) {
    var self = this;
    if (arguments.length) {
      if (typeof percent === 'number') {
        this._.percent = clamp(0, percent, 1);
      }
      if (!this.isRunning()) {
        if (immediate) {
          this._.onStep(this._getValueForPercent(percent));
        } else {
          timeline.tickAction(this._.id, function() {
            self._.onStep(self._getValueForPercent(percent));
            timeline.untickAction(self._.id);
          });
        }
      }
      return this;
    }
    return this._.percent;
  },

  duration: function(duration) {
    if (arguments.length) {
      if (typeof duration === 'number' && duration > 0) {
        this._.duration = duration;
      }
      return this;
    }
    return this._.duration;
  },

  isRunning: function() { 
    return !!this._.isRunning; 
  },

  promise: function() {
    var self = this;
    return {
      then: function(cb) {
        self.once('stop', cb);
      }
    };
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
    this.off();
    return this;
  },

  stop: function() {
    if (!this._.isRunning) return;

    this._.isRunning = false;
    timeline.untickAction(this._.id);

    this._.onStop(this._isComplete());
    return this;
  },

  restart: function(immediate) {
    if (this._.isRunning) return;

    this._.percent = this._getStartPercent();

    return this.start(!!immediate);
  },

  start: function(immediate) {
    if (this._.isRunning) return;

    if (immediate) {
      this._.onStep(this._getValueForPercent(this._.percent));
    } else {
      this._.isStarting = true;
    }

    this._.isRunning = true;
    timeline.tickAction(this._.id, this._tick);

    this._.onStart();
    return this;
  },

  _isComplete: function() {
    return !this._.isRunning && 
      this._.percent === this._getEndPercent();
  },
  _getEndPercent: function() {
    return this._.isReverse ? 0 : 1;
  },
  _getStartPercent: function() {
    return this._.isReverse ? 1 : 0;
  },

  _getValueForPercent: function(percent) {
    if (this._.easing) {
      return this._.easing(percent, this._.duration);
    }
    return percent;
  },

};

function figureOutEasing(easing) {
  if (typeof easing === 'object') {
    var dynamicType = typeof easing.type === 'string' &&
      easing.type.toLowerCase().trim();

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

// /*
//  * Tweening helpers
//  */
// function syncStyles(startingStyles, endingStyles, computedStyle) {
//   var property;
//   for (property in startingStyles) {
//     if (!endingStyles.hasOwnProperty(property)) {
//       delete startingStyles[property];
//     }
//   }
//   for (property in endingStyles) {
//     if (!startingStyles.hasOwnProperty(property)) {
//       startingStyles[property] = computedStyle[vendorizePropertyName(property)];
//     }
//   }
// }

// function makePropertyInterpolators(startingStyles, endingStyles) {
//   var interpolators = {};
//   var property;
//   for (property in startingStyles) {
//     interpolators[vendorizePropertyName(property)] = interpolate.propertyInterpolator(
//       property, startingStyles[property], endingStyles[property]
//     );
//   }
//   return interpolators;
// }

// var transformProperty;
// function vendorizePropertyName(property) {
//   if (property === 'transform') {
//     //Set transformProperty lazily, to be sure DOM has loaded already when using it
//     return transformProperty || 
//       (transformProperty = cssFeature('transform').property);
//   } else {
//     return property;
//   }
// }
