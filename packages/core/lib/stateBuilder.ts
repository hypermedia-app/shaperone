import { NodeShape, PropertyShape } from '@rdfine/shacl'
import { PropertyMatcher } from './propertyMatcher'
import { FocusNodeState, EditorChoice, PropertyGroupState, PropertyState } from './FormState'
import type { SafeClownface } from 'clownface'
import { Term } from 'rdf-js'
import TermMap from '@rdfjs/term-map'
import { FocusNode } from '../index'
import { shrink } from '@zazuko/rdf-vocabularies'
import { sh } from '@tpluscode/rdf-ns-builders'

function initialisePropertyShape(shape: PropertyShape, matchers: PropertyMatcher[], values: SafeClownface): PropertyState {
  const compoundEditors = matchers.map(matcher => matcher.matchCompoundEditor?.(shape)).filter(Boolean)[0] || []
  const objects = values.map(object => {
    const allCandidates = matchers
      .map(matcher => matcher.matchValueEditor(shape, object))
      .reduce(Array.prototype.concat)

    const editors = [...allCandidates
      .reduce<Map<Term, EditorChoice>>((editors, editorResult) => {
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

export function initialiseFocusNode(shape: NodeShape, matchers: PropertyMatcher[], focusNode: FocusNode): FocusNodeState {
  const groups = shape.property.reduce<Record<string, PropertyGroupState>>((groups, prop) => {
    let groupProps = groups[prop.group?.id?.value]
    if (!groupProps) {
      groupProps = {
        group: prop.group,
        properties: {},
      }
      groups[prop.group?.id?.value] = groupProps
    }

    groupProps.properties[prop.path.id.value] = initialisePropertyShape(prop, matchers, focusNode.out(prop.path.id))

    return groups
  }, {})

  return {
    shape,
    focusNode,
    groups,
  }
}
