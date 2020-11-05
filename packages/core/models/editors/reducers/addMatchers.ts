import produce from 'immer'
import { dash } from '@tpluscode/rdf-ns-builders'
import type { EditorsState, MultiEditor, SingleEditor } from '../index'
import { EditorMeta } from '../lib/EditorMeta'

type AnyEditor = SingleEditor<any> | MultiEditor

export function addMatchers(state: EditorsState, editors: Record<string, AnyEditor> | AnyEditor[]): EditorsState {
  return produce(state, (state) => {
    const editorsArray = Array.isArray(editors) ? editors : Object.values(editors)

    for (const editor of editorsArray) {
      const { term } = editor
      const key = editor.term.value
      const meta = new EditorMeta(state.metadata.node(term))
      const entry = {
        ...editor as any,
        meta,
      }

      state.allEditors[key] = entry

      if (meta.types.has(dash.MultiEditor)) {
        state.multiEditors[key] = entry
      } else {
        state.singleEditors[key] = entry
      }
    }
  })
}
