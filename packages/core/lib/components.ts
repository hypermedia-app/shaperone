import { GraphPointer } from 'clownface'
import { FormSettings } from '../models/forms'

export function sort([, left]: [GraphPointer, string], [, right]: [GraphPointer, string]): number {
  return left.localeCompare(right)
}

export function label(choice: GraphPointer, { languages, labelProperties }: Pick<FormSettings, 'labelProperties' | 'languages'>) {
  return choice.out(labelProperties, { language: [...languages, ''] }).values[0] || choice.value
}
