var Emitter = require('../../src/util/simple-emitter');

describe('SimpleEmitter', function() {

  it('should on() and emit()', function() {
    var receive = jasmine.createSpy('receive');
    var emitter = new Emitter();
    emitter.on('send', receive);
    emitter.emit('send');
    expect(receive).toHaveBeenCalledWith();

    receive.reset();
    emitter.emit('send', 1);
    expect(receive).toHaveBeenCalledWith(1);
  });

  it('should on() and off()', function() {
    var receive = jasmine.createSpy('receive');
    var emitter = new Emitter();
    emitter.on('send', receive);

    emitter.emit('send');
    expect(receive).toHaveBeenCalledWith();

    emitter.off('send', receive);
    receive.reset();
    emitter.emit('send');
    expect(receive).not.toHaveBeenCalled();
  });

  it('should on() and off() with multiple listeners', function() {
    var receive = jasmine.createSpy('receive');
    var receive2 = jasmine.createSpy('receive2');
    var emitter = new Emitter();
    emitter.on('send', receive);
    emitter.on('send', receive2);
    emitter.emit('send', 2);

    expect(receive).toHaveBeenCalledWith(2);
    expect(receive2).toHaveBeenCalledWith(2);

    emitter.off('send', receive2);
    receive.reset();
    receive2.reset();

    emitter.emit('send');
    expect(receive).toHaveBeenCalledWith();
    expect(receive2).not.toHaveBeenCalled();
  });

  it('should once()', function() {
    var receive = jasmine.createSpy('receive');
    var emitter = new Emitter();
    emitter.once('send', receive);
    emitter.emit('send');
    expect(receive).toHaveBeenCalledWith();
    receive.reset();
    emitter.emit('send');
    expect(receive).not.toHaveBeenCalled();
  });

  it('should off() all events for a type', function() {
    var receive = jasmine.createSpy('receive');
    var receive2 = jasmine.createSpy('receive2');
    var emitter = new Emitter();
    emitter.on('send', receive);
    emitter.on('send', receive2);
    emitter.off('send');

    emitter.emit('send');
    expect(receive).not.toHaveBeenCalledWith();
    expect(receive2).not.toHaveBeenCalled();
  });

  it('should off() all events', function() {
    var receive = jasmine.createSpy('receive');
    var receive2 = jasmine.createSpy('receive2');
    var emitter = new Emitter();
    emitter.on('send1', receive);
    emitter.on('send2', receive2);
    emitter.off();

    emitter.emit('send1');
    emitter.emit('send2');

    expect(receive).not.toHaveBeenCalledWith();
    expect(receive2).not.toHaveBeenCalled();
  });

});
