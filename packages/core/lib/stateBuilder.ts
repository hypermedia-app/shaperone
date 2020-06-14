import { NodeShape, PropertyShape } from '@rdfine/shacl'
import type { FocusNodeState, FormState, PropertyGroupState, PropertyState } from '../state'
import type { SafeClownface } from 'clownface'
import { FocusNode } from '../index'
import { shrink } from '@zazuko/rdf-vocabularies'
import { rdf, sh } from '@tpluscode/rdf-ns-builders'
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

export function initialiseFocusNode(params: { shape?: NodeShape; state: FormState; focusNode: FocusNode; selectedGroup?: string }): FocusNodeState {
  const { shape, focusNode, state, selectedGroup } = params
  const { editorMap, compoundEditorMap } = state
  const groupMap = new Map<string, PropertyGroupState>()

  if (!shape) {
    return {
      focusNode,
      groups: [],
      properties: [],
    }
  }

  if (shape.targetClass) {
    focusNode.addOut(rdf.type, shape.targetClass.id)
  }

  const properties = shape.property
    .sort(byShOrder)
    .reduce<Array<PropertyState>>((map, prop) => {
    groupMap.set(prop.group?.id?.value, {
      group: prop.group,
      order: prop.group ? prop.group.getNumber(sh.order) || 0 : -1,
      selected: prop.group?.id?.value === selectedGroup,
    })

    return [...map, initialisePropertyShape({
      shape: prop,
      editors: [...editorMap.values()],
      compoundEditors: [...compoundEditorMap.values()],
      values: focusNode.out(prop.path.id),
    })]
  }, [])

  const groups = [...groupMap.values()].sort((l, r) => l.order - r.order)
  groups[0].selected = true

  return {
    shape,
    focusNode,
    groups,
    properties: properties.sort((l, r) => byShOrder(l.shape, r.shape)),
  }
}
