import { produce } from 'immer'
import type { EditorsState, MatcherDecorator } from '../index'

export function decorate(editors: EditorsState, decorator: MatcherDecorator): EditorsState {
  return produce(editors, (draft) => {
    const decorators = editors.decorators[decorator.term.value] || []
    draft.decorators[decorator.term.value] = [
      ...decorators,
      decorator,
    ]

    const singleEditor = editors.singleEditors[decorator.term.value]
    if (singleEditor) {
      draft.singleEditors[decorator.term.value] = {
        ...singleEditor,
        match: decorator.decorate(singleEditor),
      }
    }

    const multiEditor = editors.multiEditors[decorator.term.value]
    if (multiEditor) {
      draft.multiEditors[decorator.term.value] = {
        ...multiEditor,
        match: decorator.decorate(multiEditor),
      }
    }
  })
}
