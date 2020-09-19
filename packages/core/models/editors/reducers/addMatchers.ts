import { dash } from '@tpluscode/rdf-ns-builders'
import type { EditorsState, MultiEditor, SingleEditor } from '../index'
import { EditorMeta } from '../lib/EditorMeta'

export function addMatchers(state: EditorsState, editors: Record<string, SingleEditor<any> | MultiEditor>): EditorsState {
  return Object.values(editors).reduce((newState, editor) => {
    const meta = new EditorMeta(state.metadata.node(editor.term))

    const newEntry = {
      [editor.term.value]: {
        ...editor as any,
        meta,
      },
    }

    const allEditors = { ...newState.allEditors, ...newEntry }
    let { multiEditors, singleEditors } = newState
    if (meta.types.has(dash.MultiEditor)) {
      multiEditors = { ...multiEditors, ...newEntry }
    } else {
      singleEditors = { ...singleEditors, ...newEntry }
    }

    return {
      ...newState,
      allEditors,
      multiEditors,
      singleEditors,
    }
  }, state)
}
