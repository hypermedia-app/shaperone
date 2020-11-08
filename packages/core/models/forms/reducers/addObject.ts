import { PropertyShape } from '@rdfine/shacl'
import produce from 'immer'
import { blankNode } from '@rdf-esm/data-model'
import type { FocusNode } from '../../..'
import { BaseParams, formStateReducer } from './index'
import { canAddObject, canRemoveObject } from '../lib/property'

export interface Params extends BaseParams {
  focusNode: FocusNode
  property: PropertyShape
  key: string
}

export const addObject = formStateReducer(({ state }, { focusNode, property, key }: Params) => produce(state, (draft) => {
  const focusNodeState = draft.focusNodes[focusNode.value]
  const currentProperty = focusNodeState.properties.find(p => p.shape.equals(property))

  if (!currentProperty) {
    return
  }

  currentProperty.objects.push({
    object: blankNode(),
    key,
    editors: [],
    selectedEditor: undefined,
    editorSwitchDisabled: true, // !state.shouldEnableEditorChoice({ object }),
  })
  currentProperty.canRemove = !!currentProperty.selectedEditor || canRemoveObject(property, currentProperty.objects.length)
  currentProperty.canAdd = !!currentProperty.selectedEditor || canAddObject(property, currentProperty.objects.length)
}))
