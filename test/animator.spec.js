var easings = require('../src/core/easing-functions');
var dynamics = require('../src/core/dynamics');

var cssFeature = jasmine.createSpy('cssFeature').andReturn('vendorTransform');
var timeline = {
  animationStarted: jasmine.createSpy(),
  animationStopped: jasmine.createSpy()
};

var proxyquire = require('proxyquire');
var Animator = proxyquire('../src/animator', {
  './core/timeline': timeline
});

describe('animator', function() {

  beforeEach(function() {
    timeline.animationStarted.reset();
    timeline.animationStopped.reset();
  });

  it('.duration() should set/get duration', function() {
    var animator = new Animator({
      duration: 333
    });
    expect(animator.duration()).toBe(333);
    animator.duration(-1);
    expect(animator.duration()).toBe(333);
    animator.duration('not a number');
    expect(animator.duration()).toBe(333);
    animator.duration(222);
    expect(animator.duration()).toBe(222);
  });

  it('.reverse() should set/get reverse direction', function() {
    var animator = new Animator({
      reverse: true
    });
    expect(animator.reverse()).toBe(true);
    animator.reverse(false);
    expect(animator.reverse()).toBe(false);
  });

  it('.easing() shoould set/get easing curve or dynamics type', function() {
    var animator = new Animator({
      easing: 'ease-in-out'
    });
    expect(animator.easing()(1)).toEqual(easings['ease-in-out']()(1, 100));

    animator.easing('cubic-bezier(0.1,0.2,0.3,0.4)');
    expect(animator.easing()(1, 100)).toEqual(
      easings['cubic-bezier'](0.1,0.2,0.3,0.4)(1,100)
    );

    animator.easing({
      type: 'spring'
    });
    expect(animator.easing()(1, 100)).toEqual(dynamics.spring()(1,100));
  });

  it('.percent() shoold set/get percent', function() {
    var animator = new Animator({
      percent: 0.5
    });
    expect(animator.percent()).toBe(0.5);
    animator.percent('not a number');
    expect(animator.percent()).toBe(0.5);
    animator.percent(2);
    expect(animator.percent()).toBe(1);
    animator.percent(-1);
    expect(animator.percent()).toBe(0);
    animator.percent(0.333);
    expect(animator.percent()).toBe(0.333);
  });

  it('isRunning()', function() {
    var animator = new Animator();
    expect(animator.isRunning()).toBe(false);
    animator.start();
    expect(animator.isRunning()).toBe(true);
  });

  it('.percent() should step if not running', function() {
    var animator = new Animator();
    var stepSpy = jasmine.createSpy('step');
    animator.on('step', stepSpy);
    animator.percent(0);
    expect(stepSpy).toHaveBeenCalledWith(0);

    stepSpy.reset();
    animator.start();
    animator.percent(0.5);
    expect(stepSpy).not.toHaveBeenCalled();
  });

  it('.promise() should resolve once when the animation stops', function() {
    jasmine.Clock.useMock();
    var animator = new Animator();
    var thenSpy = jasmine.createSpy('then');
    animator.promise().then(thenSpy);
    expect(thenSpy).not.toHaveBeenCalled();
    animator.start();
    animator.stop();
    expect(thenSpy).toHaveBeenCalledWith(false);
  });

  it('.destroy() should remove all listeners', function() {
    var animator = new Animator();
    var destroySpy = jasmine.createSpy('destroy');
    var stopSpy = jasmine.createSpy('stop');
    animator.on('destroy', destroySpy);
    animator.on('stop', stopSpy);
    spyOn(animator, 'off');
    animator.start();
    animator.destroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(stopSpy).toHaveBeenCalledWith(false);
    expect(animator.off).toHaveBeenCalledWith();
  });

  it('.stop() should emit stop event, tell timeline, & stop isRunning', function() {
    var animator = new Animator();
    var stopSpy = jasmine.createSpy('stop');
    var completeSpy = jasmine.createSpy('complete');
    animator.on('stop', stopSpy);
    animator.on('complete', completeSpy);
    animator._.isRunning = true;
    animator.stop();
    expect(timeline.animationStopped).toHaveBeenCalledWith(animator);
    expect(stopSpy).toHaveBeenCalledWith(false);
    expect(completeSpy).not.toHaveBeenCalledWith();
    expect(animator.isRunning()).toBe(false);

    stopSpy.reset();
    spyOn(animator, '_isComplete').andReturn(true);
    animator._.isRunning = true;
    animator.stop();
    //We DID complete this time, we're at 1 percent
    expect(stopSpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalledWith();
  });

  it('.restart() should set startPercent then start', function() {
    var animator = new Animator({
      percent: 0.3
    });
    spyOn(animator, 'start');
    expect(animator.percent()).toBe(0.3);
    animator.restart();
    expect(animator.percent()).toBe(0);
    expect(animator.start).toHaveBeenCalledWith(false);
  });

  describe('.start()', function() {
    it('should start running and call animationStarted and emit event', function() {
      var animator = new Animator();
      var startSpy = jasmine.createSpy('start');
      animator.on('start', startSpy);
      animator.start();
      expect(startSpy).toHaveBeenCalled();
      expect(animator.isRunning()).toBe(true);
      expect(timeline.animationStarted).toHaveBeenCalledWith(animator);
    });

    it('should startImmediately with parameter or isStarting', function() {
      var animator = new Animator();
      var stepSpy = jasmine.createSpy('step');
      animator.on('step', stepSpy);
      animator.start(true);
      expect(stepSpy).toHaveBeenCalledWith(0);

      animator.stop();
      stepSpy.reset();
      
      animator.start();
      expect(stepSpy).not.toHaveBeenCalled();
      expect(animator._.isStarting).toBe(true);
    });
  });

  describe('._tick()', function() {
    it('should add percent for forward, subtract for reverse, max 0/1', function() {
      var animator = new Animator({
        duration: 1000,
        percent: 0
      });
      animator._tick(100);
      expect(animator.percent()).toBe(0.1);
      animator._tick(1000);
      expect(animator.percent()).toBe(1);
      animator.reverse(true);
      animator._tick(50);
      expect(animator.percent()).toBe(0.95);
      animator._tick(1000);
      expect(animator.percent()).toBe(0);
    });

    it('if isStarting, it shouldn\'t up percent and should step', function() {
      var animator = new Animator({
        duration: 1000
      });
      var stepSpy = jasmine.createSpy('step');
      animator.on('step', stepSpy);
      animator.start();

      animator._tick(200);
      expect(animator.percent()).toBe(0);
      expect(stepSpy).toHaveBeenCalledWith(0);

      animator._tick(200);
      expect(stepSpy).toHaveBeenCalledWith(0);
      expect(animator.percent()).toBe(0.2);
      expect(stepSpy).toHaveBeenCalledWith(0.2);
    });

    it('should step with the easing value', function() {
      var animator = new Animator({
        easing: 'ease',
        duration: 1000
      });
      var stepSpy = jasmine.createSpy('step');
      animator.on('step', stepSpy);
      animator._tick(200);
      expect(stepSpy).toHaveBeenCalledWith(easings.ease()(0.2, 1000));
    });

    it('should stop at end percent', function() {
      var animator = new Animator({
        duration: 1000
      });
      spyOn(animator, 'stop');
      animator._tick(1000);
      expect(animator.stop).toHaveBeenCalled();
    });

  });
});
