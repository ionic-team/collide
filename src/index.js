
var Animator = require('./animator');

module.exports = Animator;

function CollideAnimation(config) {
  return new Animator(config);
}
