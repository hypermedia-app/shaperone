import type { PropertyShape } from '@rdfine/shacl'
import produce from 'immer'
import { nanoid } from 'nanoid'
import type { FocusNode } from '../../..'
import type { FormState } from '../index'
import { formStateReducer, BaseParams } from '../../index'
import { canAddObject, canRemoveObject } from '../lib/property'
import type { SingleEditorMatch } from '../../editors'

export interface Params extends BaseParams {
  focusNode: FocusNode
  property: PropertyShape
  editors: SingleEditorMatch[]
}

export const addFormField = formStateReducer((state: FormState, { focusNode, property, editors }: Params) => produce(state, (draft) => {
  const focusNodeState = draft.focusNodes[focusNode.value]
  const currentProperty = focusNodeState.properties.find(p => p.shape.equals(property))

  if (!currentProperty) {
    return
  }

  currentProperty.objects.push({
    key: nanoid(),
    editors,
    selectedEditor: editors[0]?.term,
    editorSwitchDisabled: !state.shouldEnableEditorChoice(),
  })
  currentProperty.canRemove = !!currentProperty.selectedEditor || canRemoveObject(property, currentProperty.objects.length)
  currentProperty.canAdd = !!currentProperty.selectedEditor || canAddObject(property, currentProperty.objects.length)
}))
