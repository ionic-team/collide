Collide
--------

Collide is a powerful yet simple javascript animation engine for web and hybrid mobile apps, inspired by [Facebook Pop](https://github.com/facebook/pop), built by the [Ionic Framework](http://ionicframework.com/) team.

Animations in Collide have more power and control than CSS animations or transitions, all without sacrificing performance.

Collide allows the user to pause, play, reverse, repeat, and skip to any part of an animation at any time, and has support for non-cubic bezier curves, enabling powerful Physics animations (Springs, Gravity, and Velocity) without the complexity of a full-fledged physics engine.

We built Collide because we wanted to give Ionic developers the power to build complicated animation and gesture driven mobile apps with HTML5 and Javascript, something that wasn't possible before.

Collide solves the problems with CSS animations using a simple Javascript animation engine and API. It also provides a tweening API similar to WebAnimations, and allows the developer to hook into every frame for full control over the behavior of the animation.

COMING SOON: 

- Tweening API
- Separating configuration phase from running the animation.
- Animation decay. Set a velocity on an animation and let it decelerate to a certain point.

### Development

- `npm install`
- `npm install -g browserify`
- `npm run build`
- Generated file `dist/collide.js` is require/CommonJS/window friendly. If you include it, it will be included as `window.collide`.
- Note: the `collide.js` found in project root is only updated on release. The built version in dist is not added to git and should be used while developing.

### API (in flux, better documentation coming after API is stable)

```js
var animator = collide.animator({
  // 'linear|ease|ease-in|ease-out|ease-in-out|cubic-bezer(x1,y1,x2,y2)' or function(t, duration) or a dynamics configuration (see below)
  easing: 'ease-in-out', 
  duration: 1000,
  percent: 0,
  iterations: 1,
  direction: 'normal', // 'normal|alternate|reverse|alternate-reverse',
});

// Actions, all of these return `this` and are chainable
// .on('step' callback is given a 'percent', 0-1, as argument
// .on('stop' callback is given a boolean, wasCompleted
animator.on(/step|destroy|start|stop/, function() {})
animator.once(...) //same event types
animator.removeListener(eventType, callback);
animator.removeAllListeners();
animator.stop();
animator.start();
animator.destroy(); //unbind all events & deallocate

// make it so the animation runs, will interpolate el from starting styles to ending styles
// returns a function to unbind the interpolation from the animation. Or you can run destroy()
var unbind = animator.addInterpolation(el, startingStyles, endingStyles); 

//These are getters and setters.
//No arguments is a getter, argument is a setter.
animator.percent(newPercent); //0-1
animator.duration(duration); //milliseconds
animator.direction(isReverse); //same as option
animator.iterations(iterationCount); //same as option
animator.easing(easing); //setter, string|function(t,duration)|dynamicsConfiguration.
// Dynamics configuration looks like this one of these:
// animator.easing({
//   type: 'spring',
//   frequency: 15,
//   friction: 200,
//   initialForce: false
// });
// animator.easing({
//   type: 'gravity',
//   frequency: 15,
//   friction: 200,
//   initialForce: false
// });

//Getters
animator.isRunning(); //boolean getter
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
