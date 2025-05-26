/* eslint-disable */

// copy of @ngard/tiny-difference to have it ESM
export function difference(array: unknown[], ...args: unknown[]) {
  const otherArrays = Array.prototype.slice.call(arguments, 1);
  if (!Array.isArray(array) || !otherArrays.every(Array.isArray)) return [];
  return array.filter(function(element) {
    return otherArrays.every(function(otherArray) {
      return otherArray.indexOf(element) === -1;
    });
  });
}
