
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

function noop() {}

var proxyquire = require('proxyquire');
var timeline = proxyquire('../../src/core/timeline', {
  'raf': mockRaf,
  'performance-now': mockTime
});

describe('timeline', function() {

  beforeEach(function() {
    lastRafId = 0;
    nextRafCb = null;
    nextTime = 0;
  });

  it('starting animation should start ticking only on first animation', function() {
    spyOn(timeline, 'tick').andCallThrough();
    timeline.tickAction({ _: { id: 0 } });
    expect(timeline.tick).toHaveBeenCalled();
    expect(timeline.isTicking).toBe(true);

    timeline.tick.reset();
    timeline.tickAction(1, noop);
    expect(timeline.tick).not.toHaveBeenCalled();
  });

  it('stopping animation should maybeStopTicking', function() {
    spyOn(timeline, 'maybeStopTicking');
    timeline.untickAction(0);
    expect(timeline.maybeStopTicking).toHaveBeenCalled();
  });

  it('maybeStopTicking should stop ticking if no animations left', function() {
    timeline._actions = { 1: noop };
    timeline.isTicking = true;
    timeline._rafId = 0;
    timeline.maybeStopTicking();
    expect(mockRaf.cancel).not.toHaveBeenCalled();

    timeline._actions = {};
    timeline.maybeStopTicking();
    expect(mockRaf.cancel).toHaveBeenCalledWith(timeline._rafId);
  });

  it('tick() should step every frame, and tick running with deltaT', function() {
    var tickSpy = jasmine.createSpy('tick');
    timeline._actions = {
      0: tickSpy
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
