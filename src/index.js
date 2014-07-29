var animation = require('./animation');

module.exports = {
  animation: animation.animation,
  tweenAnimation: animation.tweenAnimation,
  dynamics: require('./motion/dynamics')
};
