import type { PropertyGroup } from '@rdfine/shacl'
import { produce } from 'immer'
import type { BaseParams } from '../../index.js'
import { formStateReducer } from '../../index.js'
import type { FocusNode } from '../../../index.js'
import type { FormState } from '../index.js'

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
