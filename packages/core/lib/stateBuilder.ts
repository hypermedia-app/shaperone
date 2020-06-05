import { NodeShape, PropertyShape } from '@rdfine/shacl'
import { EditorMatcher, EditorMatch } from './editorMatcher'
import type { FocusNodeState, PropertyState } from '../state'
import type { SafeClownface } from 'clownface'
import { Term } from 'rdf-js'
import TermMap from '@rdfjs/term-map'
import { FocusNode } from '../index'
import { shrink } from '@zazuko/rdf-vocabularies'
import { sh } from '@tpluscode/rdf-ns-builders'
import { byShOrder } from './order'

function initialisePropertyShape(shape: PropertyShape, matchers: EditorMatcher[], values: SafeClownface): PropertyState {
  const compoundEditors = matchers.map(matcher => matcher.matchCompoundEditor?.(shape)).filter(Boolean)[0] || []
  const objects = values.map(object => {
    const allCandidates = matchers
      .map(matcher => matcher.matchValueEditor(shape, object))
      .reduce(Array.prototype.concat)

    const editors = [...allCandidates
      .reduce<Map<Term, EditorMatch>>((editors, editorResult) => {
      const previousMatch = editors.get(editorResult.editor)
      if (!previousMatch) {
        editors.set(editorResult.editor, editorResult)
        return editors
      }

      if ((previousMatch.score || 0) < (editorResult.score || 0)) {
        editors.set(editorResult.editor, editorResult)
      }

      return editors
    }, new TermMap()).values()]

    return {
      object,
      editors,
      selectedEditor: editors[0].editor,
    }
  })

  const maxReached = (shape.getNumber(sh.maxCount) || Number.POSITIVE_INFINITY) <= objects.length

  return {
    shape,
    name: shape.name?.value || shrink(shape.path.id.value),
    compoundEditors,
    objects,
    maxReached,
  }
}

export function initialiseFocusNode(shape: NodeShape, matchers: EditorMatcher[], focusNode: FocusNode): FocusNodeState {
  const groups = new Map()

  const properties = shape.property
    .sort(byShOrder)
    .reduce<Array<PropertyState>>((map, prop) => {
    groups.set(prop.group?.id?.value, prop.group)

    return [...map, initialisePropertyShape(prop, matchers, focusNode.out(prop.path.id))]
  }, [])

  return {
    shape,
    focusNode,
    groups: [...groups.values()].sort(byShOrder),
    properties,
  }
}
