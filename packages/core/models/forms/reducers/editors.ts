import { produce } from 'immer'
import type { PropertyShape } from '@rdfine/shacl'
import type { FormState, PropertyObjectState, State } from '../index.js'
import type { FocusNode } from '../../../index.js'
import type { EditorsState } from '../../editors/index.js'

type ToggleSwitchingParams = { switchingEnabled: boolean }

export const toggleSwitching = (state: FormState, { switchingEnabled }: ToggleSwitchingParams) => produce(state, (draft) => {
  draft.shouldEnableEditorChoice = () => switchingEnabled

  for (const [, focusNode] of Object.entries(draft.focusNodes)) {
    for (const property of focusNode.properties) {
      for (const objectState of <PropertyObjectState[]>property.objects) {
        const { object } = objectState
        objectState.editorSwitchDisabled = !draft.shouldEnableEditorChoice({ object })
      }
    }
  }
})

type UpdateComponentState = {
  focusNode: FocusNode
  property: PropertyShape
  object?: PropertyObjectState
  newState: Record<string, any>
}

export const updateComponentState = (state: FormState, { focusNode, property, object, newState }: UpdateComponentState) => produce(state, (draft) => {
  const propertyState = draft.focusNodes[focusNode.value].properties.find(p => p.shape.equals(property))
  if (!propertyState) return

  if (!object) {
    for (const [key, value] of Object.entries(newState)) {
      propertyState.componentState[key] = value
    }
    return
  }

  const objectState = propertyState.objects.find(({ key }) => key === object.key)
  if (objectState) {
    for (const [key, value] of Object.entries(newState)) {
      objectState.componentState[key] = value
    }
  }
})

export const recalculateEditors = (formState: State, { editors }: { editors: EditorsState }) => produce(formState, (draft: typeof formState) => {
  for (const focusNode of Object.values(draft.focusNodes)) {
    for (const property of focusNode.properties) {
      property.editors = editors.matchMultiEditors({ shape: property.shape })
      if (!property.selectedEditor) {
        property.selectedEditor = property.editors[0]?.term
      }

      for (const object of property.objects) {
        object.editors = editors.matchSingleEditors({
          object: object.object,
          shape: property.shape,
        })
        if (!object.selectedEditor) {
          object.selectedEditor = object.editors[0]?.term
        }
      }
    }
  }
})
