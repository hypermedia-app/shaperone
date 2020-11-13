import { Shape } from '@rdfine/shacl'
import { rdf, sh, rdfs } from '@tpluscode/rdf-ns-builders'
import TermMap from '@rdf-esm/term-map'
import { FocusNode } from '../../../index'

const scores = new TermMap([
  [sh.targetNode, 20],
  [sh.targetClass, 10],
  [sh.targetObjectsOf, 5],
  [sh.targetSubjectsOf, 5],
])

function toScoring(focusNode: FocusNode) {
  return (matched: [Shape, number][], shape: Shape): [Shape, number][] => {
    let score = 0
    const { targetNode, targetClass, targetObjectsOf, targetSubjectsOf } = shape
    if (targetNode.some(targetNode => targetNode.equals(focusNode.term))) {
      score = scores.get(sh.targetNode) || 0
    }

    const classIds = targetClass.map(c => c.id)
    if (shape.types.has(rdfs.Class)) {
      classIds.push(shape.id)
    }
    if (focusNode.has(rdf.type, classIds).terms.length) {
      score = Math.max(score, scores.get(sh.targetClass) || 0)
    }

    if (targetSubjectsOf && focusNode.out(targetSubjectsOf.id).terms.length) {
      score = Math.max(score, scores.get(sh.targetSubjectsOf) || 0)
    }

    if (targetObjectsOf && focusNode.in(targetObjectsOf.id).terms.length) {
      score = Math.max(score, scores.get(sh.targetObjectsOf) || 0)
    }

    return [
      ...matched,
      [shape, score],
    ]
  }
}

export function matchShapes(shapes: Shape[] = []): { to: (focusNode: FocusNode) => Shape[] } {
  return {
    to(focusNode: FocusNode) {
      return shapes.reduce(toScoring(focusNode), [])
        .filter(match => match[1] > 0)
        .sort((left, right) => right[1] - left[1])
        .map(([shape]) => shape)
    },
  }
}
