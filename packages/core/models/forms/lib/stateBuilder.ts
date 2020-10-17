import { NodeShape, PropertyShape } from '@rdfine/shacl'
import type { MultiPointer, GraphPointer } from 'clownface'
import { shrink } from '@zazuko/rdf-vocabularies'
import { dash, rdfs } from '@tpluscode/rdf-ns-builders'
import { NamedNode } from 'rdf-js'
import { ResourceNode } from '@tpluscode/rdfine/RdfResource'
import type { MultiEditor, SingleEditor, SingleEditorMatch } from '../../editors/index'
import type { FocusNodeState, PropertyGroupState, PropertyObjectState, PropertyState } from '../index'
import { FocusNode } from '../../../index'
import { byShOrder } from '../../../lib/order'
import { canAddObject, canRemoveObject } from './property'
import { getPathProperty } from '../../../lib/property'
import { matchFor } from './shapes'

export function matchEditors(shape: PropertyShape, object: GraphPointer, editors: SingleEditor[]): SingleEditorMatch[] {
  return editors.map(editor => ({ ...editor, score: editor.match(shape, object) }))
    .filter(match => match.score === null || match.score > 0)
    .sort((left, right) => {
      const leftScore = left.score || 0
      const rightScore = right.score || 0

      return rightScore - leftScore
    })
}

interface InitPropertyShapeParams {
  shape: PropertyShape
  editors: SingleEditor[]
  multiEditors: MultiEditor[]
  values: MultiPointer
}

function initialisePropertyShape(params: InitPropertyShapeParams, previous: PropertyState | undefined): PropertyState {
  const { shape, values } = params

  const editors = params.multiEditors
    .map(editor => ({ editor, score: editor.match(shape) }))
    .filter(match => match.score === null || match.score > 0)
    .map(e => e.editor) || []

  const objects = values.map<PropertyObjectState>((object) => {
    let editors = matchEditors(shape, object, params.editors)
    let selectedEditor

    const preferredEditorId = shape.get(dash.editor)?.id
    if (preferredEditorId?.termType === 'NamedNode') {
      const preferredEditor = params.editors.find(e => e.term.equals(preferredEditorId))
      selectedEditor = preferredEditorId
      if (preferredEditor) {
        editors.splice(editors.findIndex(e => e.term.equals(preferredEditor.term)), 1)
        editors = [{ ...preferredEditor, score: 100 }, ...editors]
      }
    } else {
      selectedEditor = editors[0]?.term
    }

    const previousObject = previous?.objects?.find(o => o.object.term.equals(object.term))
    if (previousObject?.selectedEditor) {
      selectedEditor = previousObject.selectedEditor
    }

    return {
      object,
      editors,
      selectedEditor,
    }
  })

  let datatype: NamedNode | undefined
  const shapeDatatype = shape.datatype
  if (shapeDatatype?.id.termType === 'NamedNode') {
    datatype = shapeDatatype.id
  }

  const editor = editors[0]
  const canRemove = !!editor || canRemoveObject(shape, objects.length)
  const canAdd = !!editor || canAddObject(shape, objects.length)

  let selectedEditor: NamedNode | undefined = editor?.term
  if (previous) {
    selectedEditor = previous.selectedEditor
  }

  return {
    shape,
    name: shape.name || shrink(getPathProperty(shape).id.value),
    editors,
    selectedEditor,
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

interface FocusNodeInitOptions {
  getMatcher?(focusNode: ResourceNode): (shape: NodeShape) => boolean
}

export function initialiseFocusNode(params: InitializeParams, previous: FocusNodeState | undefined, { getMatcher = matchFor }: FocusNodeInitOptions = {}): FocusNodeState {
  const { focusNode, editors, multiEditors, selectedGroup, shapes } = params
  const groupMap = new Map<string | undefined, PropertyGroupState>()

  if (!params.shape && !shapes.length) {
    return {
      matchingShapes: [],
      shapes: [],
      focusNode,
      groups: [],
      properties: [],
      label: '',
    }
  }

  const isMatch = getMatcher(focusNode)
  let { matchingShapes, otherShapes } = shapes.reduce(({ matchingShapes, otherShapes }, next) => {
    if (isMatch(next)) {
      return {
        matchingShapes: [...matchingShapes, next],
        otherShapes,
      }
    }

    return {
      matchingShapes,
      otherShapes: [...otherShapes, next],
    }
  }, {
    matchingShapes: [] as NodeShape[],
    otherShapes: [] as NodeShape[],
  })

  let [shape] = matchingShapes
  if (params.shape) {
    shape = params.shape
  }
  if (!shape) {
    [shape] = shapes
  }
  if (!matchingShapes.find(s => shape.equals(s))) {
    matchingShapes = [shape, ...matchingShapes]
  }

  const properties = shape.property
    .sort(byShOrder)
    .reduce<Array<PropertyState>>((map, prop) => {
    groupMap.set(prop.group?.id?.value, {
      group: prop.group,
      order: prop.group ? prop.group.order || 0 : -1,
      selected: prop.group?.id?.value === selectedGroup,
    })

    return [...map, initialisePropertyShape({
      shape: prop,
      editors,
      multiEditors,
      values: focusNode.out(getPathProperty(prop).id),
    }, previous?.properties?.find(p => p.shape.equals(prop)))]
  }, [])

  const groups = [...groupMap.values()].sort((l, r) => l.order - r.order)
  if (groups[0]) {
    groups[0].selected = true
  }

  return {
    shape,
    matchingShapes,
    shapes: [...matchingShapes, ...otherShapes],
    focusNode,
    groups,
    properties: properties.sort((l, r) => byShOrder(l.shape, r.shape)),
    label: focusNode.out(rdfs.label).value || 'Resource',
  }
}
