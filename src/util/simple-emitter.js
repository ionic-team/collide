
// All we want is an eventEmitter that doesn't use #call or #apply,
// by expecting 0-1 arguments. 
// We couldn't find this on npm, so we make our own.

module.exports = SimpleEventEmitter;

function SimpleEventEmitter() {
}

SimpleEventEmitter.prototype = {
  listeners: [],
  on: function(eventType, fn) {
    if (typeof fn !== 'function') return;
    this.listeners[eventType] || (this.listeners[eventType] = []);
    this.listeners[eventType].push(fn);
  },
  once: function(eventType, fn) {
    var self = this;
    function onceFn() {
      self.off(eventType, fn);
      self.off(eventType, onceFn);
    }
    this.on(eventType, fn);
    this.on(eventType, onceFn);
  },
  // Built-in limitation: we only expect 0-1 arguments
  // This is to save as much perf as possible when sending
  // events every frame.
  emit: function(eventType, eventArg) {
    var listeners = this.listeners[eventType] || [];
    var i = 0;
    var len = listeners.length;
    if (arguments.length === 2) {
      for (i; i < len; i++) listeners[i] && listeners[i](eventArg);
    } else {
      for (i; i < len; i++) listeners[i] && listeners[i]();
    }
  },
  off: function(eventType, fnToRemove) {
    if (!eventType) {
      //Remove all listeners
      for (var type in this.listeners) {
        this.off(type);
      }
    } else  {
      var listeners = this.listeners[eventType];
      if (listeners) {
        if (!fnToRemove) {
          listeners.length = 0;
        } else {
          var index = listeners.indexOf(fnToRemove);
          listeners.splice(index, 1);
        }
      }
    }
  } 
};
