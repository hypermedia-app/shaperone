import produce from 'immer'
import type { EditorsState, SingleEditorDecorator } from '../index'

export function decorate(editors: EditorsState, decorator: SingleEditorDecorator): EditorsState {
  return produce(editors, (draft) => {
    const decorators = editors.decorators[decorator.term.value] || []
    draft.decorators[decorator.term.value] = [
      ...decorators,
      decorator,
    ]
  })
}
