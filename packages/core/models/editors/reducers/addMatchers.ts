import { dash, rdf, rdfs } from '@tpluscode/rdf-ns-builders'
import type { EditorsState, MultiEditor, SingleEditor } from '../index'

export default function addMatchers(state: EditorsState, editors: Record<string, SingleEditor | MultiEditor>): EditorsState {
  return Object.values(editors).reduce((newState, editor) => {
    const meta = state.metadata.node(editor.term)
    const label = meta.out(rdfs.label).values[0] || editor.term.value

    const newEntry = {
      [editor.term.value]: {
        ...editor as any,
        label,
      },
    }

    const allEditors = { ...newState.allEditors, ...newEntry }
    let { multiEditors, singleEditors } = newState
    if (meta.has(rdf.type, dash.MultiEditor).terms.length) {
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
