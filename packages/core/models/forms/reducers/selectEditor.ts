import { NamedNode, Term } from 'rdf-js'
import { PropertyShape } from '@rdfine/shacl'
import { formStateReducer } from './index'
import { FocusNode } from '../../../index'

export interface SelectEditorParams {
  focusNode: FocusNode
  property: PropertyShape
  value: Term
  editor: NamedNode
}

export const selectEditor = formStateReducer(({ state }, { focusNode, property, value, editor }: SelectEditorParams) => {
  const focusNodeState = state.focusNodes[focusNode.value]
  const properties = focusNodeState.properties.map((prop) => {
    if (!prop.shape.id.equals(property.id)) {
      return prop
    }

    const objects = prop.objects.map((o) => {
      if (o.object.term.equals(value)) {
        return {
          ...o,
          selectedEditor: editor,
        }
      }

      return o
    })

    return {
      ...prop,
      objects,
    }
  })

  return {
    ...state,
    focusNodes: {
      ...state.focusNodes,
      [focusNode.value]: {
        ...focusNodeState,
        properties,
      },
    },
  }
})
