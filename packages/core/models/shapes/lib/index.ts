import { Shape } from '@rdfine/shacl'
import { rdf } from '@tpluscode/rdf-ns-builders'
import { FocusNode } from '../../../index'

export function matchFor(focusNode: FocusNode) {
  return (shape: Shape) => {
    const { targetNode, targetClass } = shape

    if (targetNode.some(targetNode => targetNode.equals(focusNode.term))) {
      return true
    }

    const classIds = targetClass.map(c => c.id)
    if (focusNode.has(rdf.type, classIds).values.some(Boolean)) {
      return true
    }

    return false
  }
}
