import { PropertyShape } from '@rdfine/shacl'
import type { NamedNode } from '@rdfjs/types'
import type { MultiPointer } from 'clownface'
import { dash } from '@tpluscode/rdf-ns-builders'
import graphPointer from 'is-graph-pointer'
import type { Store } from '../../../state/index.js'
import { FocusNode } from '../../../index.js'
import { BaseParams } from '../../index.js'
import { SingleEditorMatch } from '../../editors/index.js'

export interface AddObject extends BaseParams {
  focusNode: FocusNode
  property: PropertyShape
  overrides?: MultiPointer
  componentState?: Record<string, unknown>
}

export function addObject(store: Store) {
  const dispatch = store.getDispatch()
  return function ({ form, property, focusNode, overrides, componentState }: AddObject) {
    const { editors: editorsState, resources } = store.getState()
    const graph = resources.get(form)?.graph
    if (!graph) {
      return
    }

    const matchedEditors = editorsState.matchSingleEditors({ shape: property })
    let editors: SingleEditorMatch[]
    let selectedEditor: NamedNode | undefined
    if (property.editor?.id.termType === 'NamedNode') {
      selectedEditor = property.editor.id
      editors = [
        { term: selectedEditor, score: null, meta: editorsState.metadata.node(selectedEditor) },
        ...matchedEditors,
      ]
    } else {
      editors = matchedEditors
      selectedEditor = editors[0]?.term
    }

    if (overrides) {
      const editor = overrides.out(dash.editor)
      if (graphPointer.isNamedNode(editor)) {
        selectedEditor = editor.term
        const alreadyMatched = editors.findIndex(match => match.term.equals(selectedEditor))
        if (alreadyMatched !== -1) {
          editors.splice(alreadyMatched, 1)
        }
        editors.unshift({
          term: selectedEditor,
          score: null,
          meta: editorsState.metadata.node(selectedEditor),
        })
      }
    }

    dispatch.forms.addFormField({
      form,
      property,
      focusNode,
      editors,
      selectedEditor,
      overrides,
      componentState,
    })
  }
}
