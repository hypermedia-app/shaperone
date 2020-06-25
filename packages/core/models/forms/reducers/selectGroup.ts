import { PropertyGroup } from '@rdfine/shacl'
import { formStateReducer } from './index'
import { FocusNode } from '../../../index'

export const selectGroup = formStateReducer(function ({ state }, { group, focusNode }: { focusNode: FocusNode; group?: PropertyGroup }) {
  const groups = state.focusNodes[focusNode.value].groups.map(g => {
    let selected
    if (!group && !g.group) {
      selected = true
    } else {
      selected = group?.id.equals(g.group?.id) || false
    }

    return {
      ...g,
      selected,
    }
  })

  return {
    ...state,
    focusNodes: {
      ...state.focusNodes,
      [focusNode.value]: {
        ...state.focusNodes[focusNode.value],
        groups,
      },
    },
  }
})
