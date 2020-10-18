import { PropertyGroup } from '@rdfine/shacl'
import produce from 'immer'
import { formStateReducer } from './index'
import { FocusNode } from '../../../index'

export const selectGroup = formStateReducer(({ state }, { group, focusNode }: { focusNode: FocusNode; group?: PropertyGroup }) => produce(state, (draft) => {
  draft.focusNodes[focusNode.value].groups.forEach((g) => {
    if (!group && !g.group) {
      g.selected = true
    } else {
      g.selected = g.group?.equals(group) || false
    }
  })
}))
