import type { PropertyShape } from '@rdfine/shacl'
import produce from 'immer'
import { NamedNode } from 'rdf-js'
import type { FocusNode } from '../../..'
import type { FormState } from '../index'
import { formStateReducer, BaseParams } from '../../index'
import { canAddObject, canRemoveObject } from '../lib/property'
import type { EditorsState, SingleEditorMatch } from '../../editors'
import { nextid } from '../lib/objectid'
import { EditorMeta } from '../../editors/lib/EditorMeta'

export interface Params extends BaseParams {
  focusNode: FocusNode
  property: PropertyShape
  matchedEditors: SingleEditorMatch[]
  editors: EditorsState
}

export const addFormField = formStateReducer((state: FormState, { focusNode, property, matchedEditors, editors: { metadata } }: Params) => produce(state, (draft) => {
  const focusNodeState = draft.focusNodes[focusNode.value]
  const currentProperty = focusNodeState.properties.find(p => p.shape.equals(property))

  if (!currentProperty) {
    return
  }

  let editors: SingleEditorMatch[]
  let selectedEditor: NamedNode | undefined
  if (property.editor?.id.termType === 'NamedNode') {
    selectedEditor = property.editor.id
    editors = [
      { term: selectedEditor, score: null, meta: new EditorMeta(metadata.node(selectedEditor)) },
      ...matchedEditors,
    ]
  } else {
    editors = matchedEditors
    selectedEditor = editors[0]?.term
  }

  currentProperty.objects.push({
    key: nextid(),
    editors,
    selectedEditor,
    editorSwitchDisabled: !state.shouldEnableEditorChoice(),
    componentState: {},
  })
  currentProperty.canRemove = !!currentProperty.selectedEditor || canRemoveObject(property, currentProperty.objects.length)
  currentProperty.canAdd = !!currentProperty.selectedEditor || canAddObject(property, currentProperty.objects.length)
}))
