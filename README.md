collide-io
----------

A simple javascript animation library built on top of [collide-motion](https://github.com/driftyco/collide-motion). WIP.

COMING SOON: Tweening API, separate config object from running the animation.

### Development

- `npm install`
- `npm install -g browserify`
- `npm run build`
- Generated collide.js is require/CommonJS/window friendly. If you include it, it will be included as `window.collide`.

### API (quickly changing)

```js
var animator = collide.create({
  duration: 1000,
  easing: 'ease-in-out'
});

// .on('step' callback is given a 'percent', 0-1, as argument
// .on('complete' callback is given a boolean, wasCancelled
animator.on(/step|pause|cancel|play|complete|start/, function() {})
animator.once(...) //same events
animator.promise(); // .then(onStop(boolean wasCompleted), onCancel(boolean wasError))
animator.pause();
animator.cancel();
animator.play();
animator.percent(newPercent); //setter
animator.reverse(isReverse); //setter
animator.autoReverse(isAutoReverse); //setter
animator.repeat(repeatCount); //setter
animator.isReverse; //boolean property
animator.isPlaying; //boolean property
animator.isAutoReverse; //boolean property
animator.repeatCount; //Number property

animator.percent(0).pause(); //everything is chainable
```

### Examples

See test.html.

```js
var animator = collide.create({
  duration: 1000,
  easing: 'spring'
})
  .on('step', function(v) {
    //Have the element spring over 400px
    myElement.css('webkitTransform', 'translateX(' + (v*400) + 'px)');
  })
  .play();
```
