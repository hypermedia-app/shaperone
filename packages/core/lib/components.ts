import type { GraphPointer } from 'clownface'
import type { SingleEditorComponent } from '../models/components'

export type CoreComponent<T extends SingleEditorComponent<any>> = Omit<T, 'render' | 'lazyRender'>
export type Item = [GraphPointer, string]

export function sort([, left]: [GraphPointer, string], [, right]: [GraphPointer, string]): number {
  return left.localeCompare(right)
}
