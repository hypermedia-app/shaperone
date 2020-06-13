import { NodeShape, PropertyShape } from '@rdfine/shacl'
import type { FocusNodeState, FormState, PropertyState } from '../state'
import type { SafeClownface } from 'clownface'
import { FocusNode } from '../index'
import { shrink } from '@zazuko/rdf-vocabularies'
import { sh } from '@tpluscode/rdf-ns-builders'
import { byShOrder } from './order'
import type { CompoundEditor, Editor } from '../EditorMap'

function initialisePropertyShape(params: { shape: PropertyShape; editors: Editor[]; compoundEditors: CompoundEditor[]; values: SafeClownface }): PropertyState {
  const { shape, values } = params

  const compoundEditors = params.compoundEditors.map(({ match }) => match(shape)).filter(match => match.score === null || match.score > 0) || []
  const objects = values.map(object => {
    const editors = params.editors
      .map(({ match }) => match(shape, object))
      .filter(match => match.score === null || match.score > 0)
      .sort((left, right) => left.score! - right.score!)

    return {
      object,
      editors,
      selectedEditor: editors[0]?.editor,
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

export function initialiseFocusNode(params: { shape: NodeShape; state: FormState; focusNode: FocusNode }): FocusNodeState {
  const { shape, focusNode, state } = params
  const { editorMap, compoundEditorMap } = state
  const groups = new Map()

  const properties = shape.property
    .sort(byShOrder)
    .reduce<Array<PropertyState>>((map, prop) => {
    groups.set(prop.group?.id?.value, prop.group)

    return [...map, initialisePropertyShape({
      shape: prop,
      editors: [...editorMap.values()],
      compoundEditors: [...compoundEditorMap.values()],
      values: focusNode.out(prop.path.id),
    })]
  }, [])

  return {
    shape,
    focusNode,
    groups: [...groups.values()].sort(byShOrder),
    properties,
  }
}
