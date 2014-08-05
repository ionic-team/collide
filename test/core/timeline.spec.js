
var lastRafId;
var nextRafCb;
function mockRaf(cb) {
  nextRafCb = cb;
  return lastRafId++;
}
mockRaf.cancel = jasmine.createSpy('rafCancel');

var nextTime = 0;
function mockTime() {
  return nextTime;
}

var proxyquire = require('proxyquire');
var timeline = proxyquire('../../src/core/timeline', {
  raf: mockRaf,
  '../util/time': mockTime
});

describe('timeline', function() {

  beforeEach(function() {
    lastRafId = 0;
    nextRafCb = null;
    nextTime = 0;
  });

  it('starting animation should start ticking only on first animation', function() {
    spyOn(timeline, 'tick').andCallThrough();
    timeline.animationStarted({ _: { id: 0 } });
    expect(timeline.tick).toHaveBeenCalled();
    expect(timeline.isTicking).toBe(true);

    timeline.tick.reset();
    timeline.animationStarted({ _: { id: 1 } });
    expect(timeline.tick).not.toHaveBeenCalled();
  });

  it('stopping animation should maybeStopTicking', function() {
    spyOn(timeline, 'maybeStopTicking');
    timeline.animationStopped({ _: { id: 0 } });
    expect(timeline.maybeStopTicking).toHaveBeenCalled();
  });

  it('maybeStopTicking should stop ticking if no animations left', function() {
    timeline._running = { 1: true };
    timeline.isTicking = true;
    timeline._rafId = 0;
    timeline.maybeStopTicking();
    expect(mockRaf.cancel).not.toHaveBeenCalled();

    timeline._running = {};
    timeline.maybeStopTicking();
    expect(mockRaf.cancel).toHaveBeenCalledWith(timeline._rafId);
  });

  it('tick() should step every frame, and tick running with deltaT', function() {
    var tickSpy = jasmine.createSpy('tick');
    timeline._running = {
      0: { _tick: tickSpy }
    };
    nextTime = 0;
    timeline.tick();
    expect(tickSpy).not.toHaveBeenCalled();

    nextTime = 100;
    nextRafCb();
    expect(tickSpy).toHaveBeenCalledWith(100);

    nextTime = 149;
    nextRafCb();
    expect(tickSpy).toHaveBeenCalledWith(49);
  });
});
