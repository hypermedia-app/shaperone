import { GraphPointer } from 'clownface'
import { PropertyShape } from '@rdfine/shacl'
import produce from 'immer'
import type { FocusNode } from '../../..'
import { formStateReducer } from './index'
import { matchEditors } from '../lib/stateBuilder'
import { canAddObject, canRemoveObject } from '../lib/property'
import { defaultValue } from '../lib/defaultValue'
import { getPathProperty } from '../../../lib/property'

export interface Params {
  focusNode: FocusNode
  property: PropertyShape
  object?: GraphPointer
}

export const addObject = formStateReducer(({ state, editors }, { focusNode, property }: Params) => produce(state, (draft) => {
  const focusNodeState = draft.focusNodes[focusNode.value]

  for (const currentProperty of focusNodeState.properties) {
    if (currentProperty.shape.equals(property)) {
      let object: GraphPointer
      if (property.defaultValue) {
        object = focusNodeState.focusNode.node(property.defaultValue)
      } else {
        object = defaultValue(property, state.focusNodes[focusNode.value].focusNode)
      }
      focusNode.addOut(getPathProperty(property).id, object)
      const objectState = currentProperty.objects.find(o => o.object.term.equals(object.term))
      if (!objectState) {
        const suitableEditors = matchEditors(property, object, editors)
        currentProperty.objects.push({
          object,
          editors: suitableEditors,
          selectedEditor: suitableEditors[0]?.term,
        })
      }
      currentProperty.canRemove = !!currentProperty.selectedEditor || canRemoveObject(property, currentProperty.objects.length)
      currentProperty.canAdd = !!currentProperty.selectedEditor || canAddObject(property, currentProperty.objects.length)
    }
  }
}))
