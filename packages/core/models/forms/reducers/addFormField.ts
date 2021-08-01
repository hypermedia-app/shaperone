import type { PropertyShape } from '@rdfine/shacl'
import { NamedNode } from 'rdf-js'
import type { FocusNode } from '../../..'
import { objectStateProducer } from '../objectStateProducer'
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

export const addFormField = formStateReducer(objectStateProducer<Params>((state, { property, editors: { metadata }, matchedEditors }, currentProperty) => {
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
    validationResults: [],
    hasErrors: false,
  })
  currentProperty.canRemove = !!currentProperty.selectedEditor || canRemoveObject(property, currentProperty.objects.length)
  currentProperty.canAdd = !!currentProperty.selectedEditor || canAddObject(property, currentProperty.objects.length)
}))
