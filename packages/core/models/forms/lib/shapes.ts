import { FocusNode } from '../../../index'
import { Shape } from '@rdfine/shacl'
import { rdf, sh } from '@tpluscode/rdf-ns-builders'

export function matchFor(focusNode: FocusNode) {
  return (shape: Shape) => {
    if (shape.getArray(sh.targetNode).some(targetNode => targetNode.id.equals(focusNode.term))) {
      return true
    }

    if (shape.targetClass && focusNode.has(rdf.type, shape.targetClass.id).values.some(Boolean)) {
      return true
    }

    return false
  }
}
