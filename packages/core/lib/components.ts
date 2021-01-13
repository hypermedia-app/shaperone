import type { GraphPointer } from 'clownface'
import type { FormSettings } from '../models/forms'
import type { SingleEditorComponent } from '../models/components'

export type CoreComponent<T extends SingleEditorComponent<any>> = Omit<T, 'render' | 'lazyRender'>
export type Item = [GraphPointer, string]

export function sort([, left]: [GraphPointer, string], [, right]: [GraphPointer, string]): number {
  return left.localeCompare(right)
}

export function label(choice: GraphPointer, { languages, labelProperties }: Pick<FormSettings, 'labelProperties' | 'languages'>) {
  return choice.out(labelProperties, { language: [...languages, ''] }).values[0] || choice.value
}
