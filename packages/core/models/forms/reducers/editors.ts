import produce from 'immer'
import { PropertyShape } from '@rdfine/shacl'
import type { PropertyObjectState, FormState } from '../index'
import { BaseParams, formStateReducer } from '../..'
import { FocusNode } from '../../../index'

type ToggleSwitchingParams = BaseParams & { switchingEnabled: boolean }

export const toggleSwitching = formStateReducer((state: FormState, { switchingEnabled }: ToggleSwitchingParams) => produce(state, (draft) => {
  draft.shouldEnableEditorChoice = () => switchingEnabled

  for (const [, focusNode] of Object.entries(draft.focusNodes)) {
    for (const property of focusNode.properties) {
      for (const objectState of <PropertyObjectState[]>property.objects) {
        const { object } = objectState
        objectState.editorSwitchDisabled = !draft.shouldEnableEditorChoice({ object })
      }
    }
  }
}))

type UpdateComponentState = BaseParams & {
  focusNode: FocusNode
  property: PropertyShape
  object?: PropertyObjectState
  newState: Record<string, any>
}

export const updateComponentState = formStateReducer((state: FormState, { focusNode, property, object, newState }: UpdateComponentState) => produce(state, (draft) => {
  const propertyState = draft.focusNodes[focusNode.value].properties.find(p => p.shape.equals(property))
  if (!propertyState) return

  if (!object) {
    propertyState.componentState = {
      ...propertyState.componentState,
      ...newState,
    }
    return
  }

  const objectState = propertyState.objects.find(({ key }) => key === object.key)
  if (objectState) {
    objectState.componentState = {
      ...objectState.componentState,
      ...newState,
    }
  }
}))
