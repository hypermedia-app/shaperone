import produce from 'immer'
import { dash } from '@tpluscode/rdf-ns-builders'
import type { EditorsState, MultiEditor, SingleEditor } from '../index'
import { EditorMeta } from '../lib/EditorMeta'

export function addMatchers(state: EditorsState, editors: Record<string, SingleEditor<any> | MultiEditor>): EditorsState {
  return produce(state, (state) => {
    for (const editor of Object.values(editors)) {
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
