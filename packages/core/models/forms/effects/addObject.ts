import { PropertyShape } from '@rdfine/shacl'
import { NamedNode } from 'rdf-js'
import type { Store } from '../../../state'
import { FocusNode } from '../../../index'
import { BaseParams } from '../../index'
import { SingleEditorMatch } from '../../editors'

export interface AddObject extends BaseParams {
  focusNode: FocusNode
  property: PropertyShape
  editor: NamedNode | undefined
}

export function addObject(store: Store) {
  const dispatch = store.getDispatch()
  return function ({ form, property, focusNode, editor }: AddObject) {
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

    if (editor) {
      selectedEditor = editor
      if (!editors.find(match => match.term.equals(editor))) {
        editors.unshift({
          term: editor, score: null, meta: editorsState.metadata.node(editor),
        })
      }
    }

    dispatch.forms.addFormField({
      form,
      property,
      focusNode,
      editors,
      selectedEditor,
    })
  }
}
