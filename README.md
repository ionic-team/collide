Collide
--------

Collide is a powerful yet simple javascript animation engine for web and hybrid mobile apps, inspired by [Facebook Pop](https://github.com/facebook/pop), built by the [Ionic Framework](http://ionicframework.com/) team.

Animations in Collide have more power and control than CSS animations or transitions, all without sacrificing performance.

Collide allows the user to pause, play, reverse, repeat, and skip to any part of an animation at any time, and has support for non-cubic bezier curves, enabling powerful Physics animations (Springs, Gravity, and Velocity) without the complexity of a full-fledged physics engine.

We built Collide because we wanted to give Ionic developers the power to build complicated animation and gesture driven mobile apps with HTML5 and Javascript, something that wasn't possible before.

Collide solves the problems with CSS animations using a simple Javascript animation engine and API. It also provides a tweening API similar to WebAnimations, and allows the developer to hook into every frame for full control over the behavior of the animation.

COMING SOON: 

- Tweening API
- Seperating configuration phase from running the animation.
- Animation decay. Set a velocity on an animation and let it decelerate to a certain point.

### Development

- `npm install`
- `npm install -g browserify`
- `npm run build`
- Generated file `dist/collide.js` is require/CommonJS/window friendly. If you include it, it will be included as `window.collide`.
- Note: the `collide.js` found in project root is only updated on release. The built version in dist is not added to git and should be used while developing.

### API (quickly changing)

```js
var animator = collide.Animator({
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

animator.isReverse(); //boolean getter
animator.isPlaying(); //boolean getter

animator.percent(0).pause(); //chainable
```

### Examples

See test.html.

```js
var animator = collide.Animator({
  duration: 1000,
  easing: 'spring'
})
  .on('step', function(v) {
    //Have the element spring over 400px
    myElement.css('webkitTransform', 'translateX(' + (v*400) + 'px)');
  })
  .play();
```
