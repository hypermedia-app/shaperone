import produce from 'immer'
import { dash } from '@tpluscode/rdf-ns-builders'
import type { Editor, EditorsState, MultiEditor, SingleEditor } from '../index'
import { EditorMeta } from '../lib/EditorMeta'

type AnyEditor = SingleEditor<any> | MultiEditor

function decorate<T extends Editor>(decorators: EditorsState['decorators'], editor: T): T {
  return (decorators[editor.term.value] || []).reduce((editor, { decorate }) => ({
    ...editor,
    match: decorate(editor),
  }), editor)
}

export function addMatchers(state: EditorsState, editors: Record<string, AnyEditor> | AnyEditor[]): EditorsState {
  return produce(state, (draft) => {
    const editorsArray = Array.isArray(editors) ? editors : Object.values(editors)

    for (const editor of editorsArray) {
      const { term } = editor
      const key = editor.term.value
      const meta = new EditorMeta(state.metadata.node(term))
      const entry = {
        ...editor as any,
        meta,
      }

      draft.allEditors[key] = entry

      if (meta.types.has(dash.MultiEditor)) {
        draft.multiEditors[key] = decorate(state.decorators, entry)
      } else {
        draft.singleEditors[key] = decorate(state.decorators, entry)
      }
    }
  })
}
