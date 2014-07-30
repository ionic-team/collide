/**
 * A HUGE thank you to dynamics.js which inspired these dynamics simulations.
 * https://github.com/michaelvillar/dynamics.js
 *
 * Also licensed under MIT
 */

var extend = require('../util/extend');

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
  opts = extend({}, springDefaults, opts || {});

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
  opts = extend({}, gravityDefaults, opts || {});
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
