var dynamics = require('./dynamics');
var bezier = require('./bezier');

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
