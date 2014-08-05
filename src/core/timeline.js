
var raf = require('raf');
var time = require('performance-now');

var self = module.exports = {
  _running: {},

  animationStarted: function(instance) {
    self._running[instance._.id] = instance;

    if (!self.isTicking) {
      self.tick();
    }
  },

  animationStopped: function(instance) {
    delete self._running[instance._.id];
    self.maybeStopTicking();
  },

  tick: function() {
    var lastFrame = time();

    self.isTicking = true;
    self._rafId = raf(step);

    function step() {
      self._rafId = raf(step);

      // Get current time
      var now = time();
      var deltaT = now - lastFrame;

      for (var animationId in self._running) {
        self._running[animationId]._tick(deltaT);
      }

      lastFrame = now;
    }
  },

  maybeStopTicking: function() {
    if (self.isTicking && !Object.keys(self._running).length) {
      raf.cancel(self._rafId);
      self.isTicking = false;
    }
  },

};

