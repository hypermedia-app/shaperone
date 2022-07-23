import { PropertyGroup } from '@rdfine/shacl'
import { produce } from 'immer'
import { BaseParams, formStateReducer } from '../../index.js'
import { FocusNode } from '../../../index'
import type { FormState } from '../index'

export interface Params extends BaseParams {
  focusNode: FocusNode
  group?: PropertyGroup
}

export const selectGroup = formStateReducer((state: FormState, { group, focusNode }: Params) => produce(state, (draft) => {
  draft.focusNodes[focusNode.value].groups.forEach((g) => {
    if (!group && !g.group) {
      g.selected = true
    } else {
      g.selected = g.group?.equals(group) || false
    }
  })
}))
