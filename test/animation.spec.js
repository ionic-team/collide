var easings = require('../src/core/easing-functions');
var dynamics = require('../src/core/dynamics');

var cssFeature = jasmine.createSpy('cssFeature').andReturn('vendorTransform');
var timeline = {
  tickAction: jasmine.createSpy('tickAction'),
  untickAction: jasmine.createSpy('untickAction')
};

var proxyquire = require('proxyquire');
var Animation = proxyquire('../src/animation', {
  './core/timeline': timeline
});

describe('animation', function() {

  beforeEach(function() {
    timeline.tickAction.reset();
    timeline.untickAction.reset();
  });

  it('.duration() should set/get duration', function() {
    var animation = new Animation({
      duration: 333
    });
    expect(animation.duration()).toBe(333);
    animation.duration(-1);
    expect(animation.duration()).toBe(333);
    animation.duration('not a number');
    expect(animation.duration()).toBe(333);
    animation.duration(222);
    expect(animation.duration()).toBe(222);
  });

  it('.reverse() should set/get reverse direction', function() {
    var animation = new Animation({
      reverse: true
    });
    expect(animation.reverse()).toBe(true);
    animation.reverse(false);
    expect(animation.reverse()).toBe(false);
  });

  it('.easing() shoould set/get easing curve or dynamics type', function() {
    var animation = new Animation({
      easing: 'ease-in-out'
    });
    expect(animation.easing()(1)).toEqual(easings['ease-in-out']()(1, 100));

    animation.easing('cubic-bezier(0.1,0.2,0.3,0.4)');
    expect(animation.easing()(1, 100)).toEqual(
      easings['cubic-bezier'](0.1,0.2,0.3,0.4)(1,100)
    );

    animation.easing({
      type: 'spring'
    });
    expect(animation.easing()(1, 100)).toEqual(dynamics.spring()(1,100));
  });

  it('.percent() should set/get percent', function() {
    var animation = new Animation({
      percent: 0.5
    });
    expect(animation.percent()).toBe(0.5);
    animation.percent('not a number');
    expect(animation.percent()).toBe(0.5);
    animation.percent(2);
    expect(animation.percent()).toBe(1);
    animation.percent(-1);
    expect(animation.percent()).toBe(0);
    animation.percent(0.333);
    expect(animation.percent()).toBe(0.333);
  });

  it('isRunning()', function() {
    var animation = new Animation();
    expect(animation.isRunning()).toBe(false);
    animation.start();
    expect(animation.isRunning()).toBe(true);
  });

  it('.percent() should step on next tick if not running', function() {
    var animation = new Animation();
    animation.percent(0);
    expect(timeline.tickAction).toHaveBeenCalled();

    animation.start();
    timeline.tickAction.reset();
    animation.percent(0.5);
    //Already running, no need to tick the pause action in
    expect(timeline.tickAction).not.toHaveBeenCalled();
  });

  it('.promise() should resolve once when the animation stops', function() {
    jasmine.Clock.useMock();
    var animation = new Animation();
    var thenSpy = jasmine.createSpy('then');
    animation.promise().then(thenSpy);
    expect(thenSpy).not.toHaveBeenCalled();
    animation.start();
    animation.stop();
    expect(thenSpy).toHaveBeenCalledWith(false);
  });

  it('.destroy() should remove all listeners', function() {
    var animation = new Animation();
    var destroySpy = jasmine.createSpy('destroy');
    var stopSpy = jasmine.createSpy('stop');
    animation.on('destroy', destroySpy);
    animation.on('stop', stopSpy);
    spyOn(animation, 'off');
    animation.start();
    animation.destroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(stopSpy).toHaveBeenCalledWith(false);
    expect(animation.off).toHaveBeenCalledWith();
  });

  it('.stop() should emit stop event, tell timeline, & stop isRunning', function() {
    var animation = new Animation();
    var stopSpy = jasmine.createSpy('stop');
    var completeSpy = jasmine.createSpy('complete');
    animation.on('stop', stopSpy);
    animation.on('complete', completeSpy);
    animation._.isRunning = true;
    animation.stop();
    expect(timeline.untickAction).toHaveBeenCalledWith(animation._.id);
    expect(stopSpy).toHaveBeenCalledWith(false);
    expect(completeSpy).not.toHaveBeenCalledWith();
    expect(animation.isRunning()).toBe(false);

    stopSpy.reset();
    animation._.isRunning = true;
    animation._.percent = 1;
    animation.stop();
    //We DID complete this time, we're at 1 percent
    expect(stopSpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalledWith();
  });

  it('.restart() should set startPercent then start', function() {
    var animation = new Animation({
      percent: 0.3
    });
    spyOn(animation, 'start');
    expect(animation.percent()).toBe(0.3);
    animation.restart();
    expect(animation.percent()).toBe(0);
    expect(animation.start).toHaveBeenCalledWith(false);
  });

  describe('.start()', function() {
    it('should start running and call tickAction and emit event', function() {
      var animation = new Animation();
      var startSpy = jasmine.createSpy('start');
      animation.on('start', startSpy);
      animation.start();
      expect(startSpy).toHaveBeenCalled();
      expect(animation.isRunning()).toBe(true);
      expect(timeline.tickAction).toHaveBeenCalledWith(animation._.id, animation._tick);
    });

    it('should startImmediately with parameter', function() {
      var animation = new Animation();
      var stepSpy = jasmine.createSpy('step');
      animation.on('step', stepSpy);
      animation.start(true);
      expect(stepSpy).toHaveBeenCalledWith(0);

      animation.stop();
      stepSpy.reset();
      
      animation.start();
      expect(stepSpy).not.toHaveBeenCalled();
    });
  });

  describe('._tick()', function() {
    it('should add percent for forward, subtract for reverse, max 0/1', function() {
      var animation = new Animation({
        duration: 1000,
        percent: 0
      });
      animation._tick(100);
      expect(animation.percent()).toBe(0.1);
      animation._tick(1000);
      expect(animation.percent()).toBe(1);
      animation.reverse(true);
      animation._tick(50);
      expect(animation.percent()).toBe(0.95);
      animation._tick(1000);
      expect(animation.percent()).toBe(0);
    });

    it('should step with the easing value', function() {
      spyOn(easings, 'ease').andReturn(function(t) {
        return t;
      });
      var animation = new Animation({
        easing: 'ease',
        duration: 1000
      });
      var stepSpy = jasmine.createSpy('step');
      animation.on('step', stepSpy);
      animation._tick(200);
      expect(stepSpy).toHaveBeenCalledWith(0);
      animation._tick(200);
      expect(stepSpy).toHaveBeenCalledWith(0.2);
    });

    it('should stop at end percent', function() {
      var animation = new Animation({
        duration: 1000
      });
      spyOn(animation, 'stop');
      animation._tick(1000);
      animation._tick();
      expect(animation.stop).toHaveBeenCalled();
    });

  });
});
