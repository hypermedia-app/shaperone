import type { NodeKind, PropertyShape } from '@rdfine/shacl'
import { NamedNode } from 'rdf-js'
import type { FocusNode } from '../../..'
import { objectStateProducer } from '../objectStateProducer.js'
import { formStateReducer, BaseParams } from '../../index.js'
import { canAddObject, canRemoveObject } from '../lib/property.js'
import type { SingleEditorMatch } from '../../editors'
import { nextid } from '../lib/objectid.js'

export interface Params extends BaseParams {
  focusNode: FocusNode
  property: PropertyShape
  editors: SingleEditorMatch[]
  selectedEditor: NamedNode | undefined
  nodeKind: NodeKind | undefined
}

export const addFormField = formStateReducer(objectStateProducer<Params>((state, { property, editors, selectedEditor, nodeKind }, currentProperty) => {
  currentProperty.objects.push({
    key: nextid(),
    editors,
    selectedEditor,
    editorSwitchDisabled: !state.shouldEnableEditorChoice(),
    componentState: {},
    validationResults: [],
    hasErrors: false,
    nodeKind,
  })
  currentProperty.canRemove = !!currentProperty.selectedEditor || canRemoveObject(property, currentProperty.objects.length)
  currentProperty.canAdd = !!currentProperty.selectedEditor || canAddObject(property, currentProperty.objects.length)
}))
