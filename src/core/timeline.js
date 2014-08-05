
var raf = require('raf');
var time = require('performance-now');

var self = module.exports = {
  _actions: {},
  isTicking: false,

  tickAction: function(id, action) {
    self._actions[id] = action;

    if (!self.isTicking) {
      self.tick();
    }
  },

  untickAction: function(id) {
    delete self._actions[id];
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

      for (var id in self._actions) {
        self._actions[id](deltaT);
      }

      lastFrame = now;
    }
  },

  maybeStopTicking: function() {
    if (self.isTicking && !Object.keys(self._actions).length) {
      raf.cancel(self._rafId);
      self.isTicking = false;
    }
  },

};

