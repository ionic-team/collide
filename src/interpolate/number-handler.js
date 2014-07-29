/**
 * Modified version of web-animations number-handler.js
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

module.exports = {
  parseNumber: parseNumber,
  mergeNumbers: mergeNumbers,
  numberToString: numberToString,
  clampedMergeNumbers: clampedMergeNumbers
};

function numberToString(x) {
  return x.toFixed(3).replace('.000', '');
}

function clamp(min, max, x) {
  return Math.min(max, Math.max(min, x));
}

function parseNumber(string) {
  if (/^\s*[-+]?(\d*\.)?\d+\s*$/.test(string))
    return Number(string);
}

function mergeNumbers(left, right) {
  return [left, right, numberToString];
}

function clampedMergeNumbers(min, max) {
  return function(left, right) {
    return [left, right, function(x) {
      return numberToString(clamp(min, max, x));
    }];
  };
}
