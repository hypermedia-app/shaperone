import type { PropertyGroup } from '@rdfine/shacl'
import { produce } from 'immer'
import type { FocusNode } from '../../../index.js'
import type { FormState } from '../index.js'

export interface Params {
  focusNode: FocusNode
  group?: PropertyGroup
}

export const selectGroup = (state: FormState, { group, focusNode }: Params) => produce(state, (draft) => {
  draft.focusNodes[focusNode.value].groups.forEach((g) => {
    if (!group && !g.group) {
      g.selected = true
    } else {
      g.selected = g.group?.equals(group) || false
    }
  })
})
