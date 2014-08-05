module.exports = this.performance && performance.now ?
  function() { return performance.now(); } :
  Date.now;
