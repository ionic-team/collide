
var counter = 1;
var running = {};

/**
 * The main motion system manager. Treated as a singleton.
 */
module.exports = {
  animationStarted: function(instance) {
    var id = counter++;

    // Compacting running db automatically every few new animations
    if (id % 20 === 0) {
      var newRunning = {};
      for (var usedId in running) {
        newRunning[usedId] = true;
      }
      running = newRunning;
    }

    // Mark as running
    running[id] = true;

    instance.isRunning = true;
    instance._animationId = id;

    // Return unique animation ID
    return id;
  },

  animationStopped: function(instance) {
    instance.isRunning = false;
  },

  /* TODO: Move animation set management here instead of instance
  anims: [],
  add: function(animation) {
    this.anims.push(animation);
  },
  remove: function(animation) {
    var i, j;
    for(i = 0, j = this.anims.length; i < j; i++) {
      if(this.anims[i] === animation) {
        return this.anims.splice(i, 1);
      }
    }
  },
  clear: function(shouldStop) {
    while(this.anims.length) {
      var anim = this.anims.pop();
      if(shouldStop === true) {
        anim.stop();
      }
    }
  },
  */

  /**
   * Stops the given animation.
   *
   * @param id {Integer} Unique animation ID
   * @return {Boolean} Whether the animation was stopped (aka, was running before)
   * TODO: Requires above fix
  stop: function(id) {
    var cleared = running[id] != null;
    if (cleared) {
      running[id] = null;
    }

    return cleared;
  },
   */


  /**
   * Whether the given animation is still running.
   *
   * @param id {Integer} Unique animation ID
   * @return {Boolean} Whether the animation is still running
  isRunning: function(id) {
    return running[id] != null;
  },
   */

};
