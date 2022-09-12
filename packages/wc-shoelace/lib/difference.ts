// copy of @ngard/tiny-difference to have it ESM
export function difference(array: unknown[], ...args: unknown[]) {
  const otherArrays = Array.prototype.slice.call(args, 1)
  if (!Array.isArray(array) || !otherArrays.every(Array.isArray)) return []
  return array.filter(element => otherArrays.every(otherArray => otherArray.indexOf(element) === -1))
}
