/**
 * Modified version of web-animations interpolate.js
 */

// Copyright 2014 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
// limitations under the License.


var colorHandler = require('./color-handler');
var dimensionHandler = require('./dimension-handler');
var numberHandler = require('./number-handler');
var transformHandler = require('./transform-handler');

var propertyHandlers = {};

module.exports = {
  propertyInterpolator: propertyInterpolator
};

//Handler to tween colors
addPropertiesHandler(
  colorHandler.parseColor, 
  colorHandler.mergeColors, 
  ['color', 'backgroundColor']
);

//Handler to tween dimensions
addPropertiesHandler(
  dimensionHandler.parseLengthOrPercent, 
  dimensionHandler.mergeDimensions, 
  ['left', 'right', 'top', 'bottom', 'width', 'height', 'border-width']
);

// Handler to tween opacity and keep it between 0/1
addPropertiesHandler(
  numberHandler.parseNumber, 
  numberHandler.clampedMergeNumbers(0, 1), 
  ['opacity']
);

// Handler to tween any transform value
addPropertiesHandler(
  transformHandler.parseTransform,
  transformHandler.mergeTransforms,
  ['transform']
);


function addPropertiesHandler(parser, merger, properties) {
  for (var i = 0; i < properties.length; i++) {
    var property = properties[i];
    propertyHandlers[property] = propertyHandlers[property] || [];
    propertyHandlers[property].push([parser, merger]);
  }
}

function propertyInterpolator(property, left, right) {
  var handlers = left == right ? [] : propertyHandlers[property];
  for (var i = 0; handlers && i < handlers.length; i++) {
    var parsedLeft = handlers[i][0](left);
    var parsedRight = handlers[i][0](right);
    if (parsedLeft !== undefined && parsedRight !== undefined) {
      var interpolationArgs = handlers[i][1](parsedLeft, parsedRight);
      if (interpolationArgs)
        return makeInterpolator.apply(null, interpolationArgs);
    }
  }
  return makeInterpolator(false, true, function(bool) {
    return bool ? right : left;
  });
}

function makeInterpolator(from, to, convertToString) {
  return function(f) {
    return convertToString(interpolate(from, to, f));
  };
}

function interpolate(from, to, f) {
  if ((typeof from == 'number') && (typeof to == 'number')) {
    return from * (1 - f) + to * f;
  }
  if ((typeof from == 'boolean') && (typeof to == 'boolean')) {
    return f < 0.5 ? from : to;
  }
  if (from.length == to.length) {
    var r = [];
    for (var i = 0; i < from.length; i++) {
      r.push(interpolate(from[i], to[i], f));
    }
    return r;
  }
  throw 'Mismatched interpolation arguments ' + from + ':' + to;
}
