var Animator = require('./animator');
var extend = require('node.extend');
var transformFeature = require('feature/css')('transform');
var interpolate = require('./interpolate');

module.exports = {
  animation: Animation,
  tweenAnimation: TweenAnimation
};

function Animation(config) {
  return Animator(config);
}

var tweenDefaultOptions = {
  fill: 'both'
};
function TweenAnimation(el, startingStyles, endingStyles, config) {
  var options = extend({}, tweenDefaultOptions, config);

  syncStyles(startingStyles, endingStyles, window.getComputedStyle(el));
  var interpolators = makePropertyInterpolators(startingStyles, endingStyles);

  var animator = Animator(options);
  animator.on('step', function(percent) {
    for (var property in interpolators) {
      el.style[property] = interpolators[property](percent);
    }
  });
  if (options.fill !== 'both' && options.fill !== 'forwards') {
    animator.on('complete', function() {
      for (var property in interpolators) {
        el.style[property] = '';
      }
    });
  }

  return animator;
}

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

function vendorizePropertyName(property) {
  if (property === 'transform') {
    return transformFeature.property;
  } else {
    return property;
  }
}
