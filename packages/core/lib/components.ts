import { GraphPointer } from 'clownface'

export function sort([, left]: [GraphPointer, string], [, right]: [GraphPointer, string]): number {
  return left.localeCompare(right)
}
