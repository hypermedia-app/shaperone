import produce from 'immer'
import { PropertyShape } from '@rdfine/shacl'
import type { MultiEditor, SingleEditorMatch } from '../../editors/index'
import type { PropertyObjectState } from '../index'
import { formStateReducer } from './index'
import { FocusNode } from '../../../index'

export interface SetSingleEditorsParams {
  focusNode: FocusNode
  object: string
  propertyShape: PropertyShape
  editors: SingleEditorMatch[]
}

export const setSingleEditors = formStateReducer(({ state }, { editors, focusNode, propertyShape, object } :SetSingleEditorsParams) => produce(state, (draft) => {
  const propertyState = draft.focusNodes[focusNode.value]?.properties.find(property => property.shape.equals(propertyShape))
  const objectState = propertyState?.objects.find(os => os.key === object)
  if (objectState) {
    objectState.editors = editors
    if (!objectState.selectedEditor || !editors.find(editor => editor.term.equals(objectState.selectedEditor))) {
      objectState.selectedEditor = editors[0]?.term
    }
  }
}))

export interface SetMultiEditorsParams {
  focusNode: FocusNode
  propertyShape: PropertyShape
  editors: MultiEditor[]
}

export const setPropertyEditors = formStateReducer(({ state }, { focusNode, propertyShape, editors }: SetMultiEditorsParams) => produce(state, (draft) => {
  const propertyState = draft.focusNodes[focusNode.value]?.properties.find(property => property.shape.equals(propertyShape))

  if (propertyState) {
    propertyState.editors = editors
  }
}))

export const toggleSwitching = formStateReducer<{ switchingEnabled: boolean }>(({ state }, { switchingEnabled }) => produce(state, (draft) => {
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
