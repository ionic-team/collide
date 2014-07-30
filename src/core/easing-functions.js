var dynamics = require('./dynamics');
var bezier = require('./bezier');

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
