
/*
 * There really is no tiny minimal extend() on npm to find,
 * so we just use our own.
 */

module.exports = function extend(obj) {
   var args = Array.prototype.slice.call(arguments, 1);
   for(var i = 0; i < args.length; i++) {
     var source = args[i];
     if (source) {
       for (var prop in source) {
         obj[prop] = source[prop];
       }
     }
   }
   return obj;
};
