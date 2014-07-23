
var easingFn = require('./motion/easing-functions');
var EventEmitter = require('events');
var Motion = require('./motion/instance');
var Promise = require('promiscuous');
var extend = require('node.extend');

function noop(){}

module.exports = CollideAnimator;

function CollideAnimator(config) {
  var self;
  var eventTypes = [
    'step',
    'pause', 
    'cancel', 
    'play', 
    'complete', //complete callback is passed boolean wasCancelled
    'start', 
    'error'
  ];
  var emitter = new EventEmitter();

  config.step = onMotionStep;
  config.onComplete = onMotionComplete;
  var motion = createMotion(config);

  return self = {
    //Functions
    autoReverse: autoReverse,
    cancel: cancel,
    on: onWithTypeCheck(emitter.on),
    once: onWithTypeCheck(emitter.once),
    pause: pause,
    percent: percent,
    play: play,
    promise: promise,
    repeat: repeat,
    reverse: noop,

    //Properties
    isPlaying: false,
    isReverse: motion.reverse,
    isAutoReverse: false,
    repeatCount: -1
  };

  function onMotionStep(v) {
    emitter.emit('step', v);
    if ((v === 0 && self.isReverse) || v === 1)  {
      emitter.emit('start');
    }
  }

  function onMotionComplete(didFinish) {
    var wasCancelled = !didFinish;
    emitter.emit('complete', wasCancelled);
  }
  
  function onWithTypeCheck(emitterFn) {
    return function addEventListener(eventType, listener) {
      if (eventTypes.indexOf(eventType) === -1) {
        throw new Error('bad eventType ' + eventType);
      }
      emitterFn.call(emitter, eventType, listener);
      return self;
    };
  }

  function cancel() {
    motion.stop();
    emitter.emit('complete', true);
    emitter.emit('cancel');
    emitter.removeAllListeners();
    self.isPlaying = false;
    return self;
  }

  function pause() {
    motion.pause();
    emitter.emit('pause');
    self.isPlaying = false;
    return self;
  }
  
  function percent(n) {
    motion.setPercent(n);
    return self;
  }

  function play() {
    if (motion.isPaused) {
      motion.play();
    } else {
      motion.start();
    }
    emitter.emit('play');
    self.isPlaying = true;
    return self;
  }

  function promise() {
    //On completion: resolve with true
    //On pause: resolve with false 
    //On cancel: reject
    //myAnimator.promise().then(function onStop(wasCompleted) {
    //});
    return new Promise(function(resolve, reject) {
      emitter.on('complete', onComplete);
      emitter.on('pause', onPause);

      function onComplete(wasCancelled) {
        if (wasCancelled) {
          reject();
        } else {
          resolve(true);
        }
        cleanup();
      }
      function onPause() {
        resolve();
        cleanup();
      }
      function cleanup() {
        emitter.removeListener('complete', onComplete);
        emitter.removeListener('pause', onPause);
      }
    });
  }

  function reverse(isReverse) {
    motion.reverse = self.isReverse = !!isReverse;
    return self;
  }

  function autoReverse(isAutoReverse) {
    motion.autoReverse = self.autoReverse = !!isAutoReverse;
    return self;
  }

  function repeat(n) {
    motion.repeat = self.repeatCount = n;
    return self;
  }
}


function createMotion(opts) {
  if(typeof opts.easing === 'string') {
    tf = easingFn[opts.easing] || easingFn.linear;
    if(opts.easing.indexOf('cubic-bezier(') >= 0) {
      var parts = opts.easing.replace('cubic-bezier(', '').replace(')', '').split(',');
      tf = easingFn['cubic-bezier'];
      tf = tf(parts[0], parts[1], parts[2], parts[3], opts.duration);
    } else {
      tf = tf(opts.duration);
    }
  } else {
    tf = opts.easing;
    tf = tf(opts.duration);
  }

  opts.easingFn = tf;

  if(opts.dynamicsType) {
    opts.dynamic = new opts.dynamicsType(opts);
  }
  return new Motion(opts);
}
