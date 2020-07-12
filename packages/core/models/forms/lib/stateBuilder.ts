import { NodeShape, PropertyShape } from '@rdfine/shacl'
import type { SafeClownface, SingleContextClownface } from 'clownface'
import { shrink } from '@zazuko/rdf-vocabularies'
import { dash, sh } from '@tpluscode/rdf-ns-builders'
import { NamedNode } from 'rdf-js'
import type { MultiEditor, SingleEditor } from '../../editors/index'
import type { FocusNodeState, PropertyGroupState, PropertyState } from '../index'
import { FocusNode } from '../../../index'
import { byShOrder } from '../../../lib/order'
import { canAddObject, canRemoveObject } from './property'

export function matchEditors(shape: PropertyShape, object: SingleContextClownface, editors: SingleEditor[]): SingleEditor[] {
  return editors.map(editor => ({ editor, score: editor.match(shape, object) }))
    .filter(match => match.score === null || match.score > 0)
    .sort((left, right) => {
      const leftScore = left.score || 0
      const rightScore = right.score || 0

      return rightScore - leftScore
    })
    .map(e => e.editor)
}

function initialisePropertyShape(params: { shape: PropertyShape; editors: SingleEditor[]; multiEditors: MultiEditor[]; values: SafeClownface }): PropertyState {
  const { shape, values } = params

  const editors = params.multiEditors
    .map(editor => ({ editor, score: editor.match(shape) }))
    .filter(match => match.score === null || match.score > 0)
    .map(e => e.editor) || []

  const objects = values.map((object) => {
    let editors = matchEditors(shape, object, params.editors)
    let selectedEditor

    const preferredEditorId = shape.get(dash.editor)?.id
    if (preferredEditorId?.termType === 'NamedNode') {
      const preferredEditor = params.editors.find(e => e.term.equals(preferredEditorId))
      selectedEditor = preferredEditorId
      if (preferredEditor) {
        editors.splice(editors.indexOf(preferredEditor), 1)
        editors = [preferredEditor, ...editors]
      }
    } else {
      selectedEditor = editors[0]?.term
    }

    return {
      object,
      editors,
      selectedEditor,
    }
  })

  let datatype: NamedNode | undefined
  const shapeDatatype = shape.get(sh.datatype)
  if (shapeDatatype?.id.termType === 'NamedNode') {
    datatype = shapeDatatype.id
  }

  const editor = editors[0]
  const canRemove = !!editor || canRemoveObject(shape, objects.length)
  const canAdd = !!editor || canAddObject(shape, objects.length)

  return {
    shape,
    name: shape.name?.value || shrink(shape.path.id.value),
    editors,
    selectedEditor: editor?.term,
    objects,
    canRemove,
    canAdd,
    datatype,
  }
}

interface InitializeParams {
  shapes: NodeShape[]
  shape?: NodeShape
  editors: SingleEditor[]
  multiEditors: MultiEditor[]
  focusNode: FocusNode
  selectedGroup?: string
}

export function initialiseFocusNode(params: InitializeParams): FocusNodeState {
  const { focusNode, editors, multiEditors, selectedGroup } = params
  let { shapes } = params
  const groupMap = new Map<string, PropertyGroupState>()

  if (!params.shape && !shapes.length) {
    return {
      shapes,
      focusNode,
      groups: [],
      properties: [],
    }
  }

  let [shape] = shapes
  if (params.shape) {
    shape = params.shape
  }
  if (!shapes.find(s => s.id.equals(shape.id))) {
    shapes = [shape, ...shapes]
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
      editors,
      multiEditors,
      values: focusNode.out(prop.path.id),
    })]
  }, [])

  const groups = [...groupMap.values()].sort((l, r) => l.order - r.order)
  if (groups[0]) {
    groups[0].selected = true
  }

  return {
    shape,
    shapes,
    focusNode,
    groups,
    properties: properties.sort((l, r) => byShOrder(l.shape, r.shape)),
  }
}
