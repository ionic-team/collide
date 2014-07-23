collide-io
----------

A simple javascript animation library built on top of [collide-motion](https://github.com/driftyco/collide-motion). WIP.

Objective: to provide animations with more power and control than css animations provide, without sacrificing performance.

Why aren’t CSS animations powerful enough? Not enough contorl. Here's a common example: If we’re dragging out a sidemenu in our mobile app, we need a way to sync the drag gesture with the sidemenu’s animation. This is not doable with CSS animations.

Collide provides both a tweening API for easy-use (an API very similar to WebAnimations), and allows the user to do custom behavior every frame for more complicated cases than tweening can handle.

Collide allows the user to pause, play, reverse, repeat, and skip to any part of an animation at any time.


COMING SOON: 

- Tweening API
- Seperating configuration phase from running the animation.
- Animation decay. Set a velocity on an animation and let it decelerate to a certain point.

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
