import type { NodeShape, PropertyShape } from '@rdfine/shacl'
import type { GraphPointer } from 'clownface'
import { dash } from '@tpluscode/rdf-ns-builders'
import { NamedNode } from 'rdf-js'
import RdfResource from '@tpluscode/rdfine/RdfResource'
import type { EditorsState } from '../../editors/index'
import type { FocusNodeState, PropertyGroupState, PropertyObjectState, PropertyState, ShouldEnableEditorChoice } from '../index'
import { FocusNode } from '../../../index'
import { byShOrder } from '../../../lib/order'
import { canAddObject, canRemoveObject } from './property'
import PropertyShapeEx from '../../shapes/lib/PropertyShape'
import { nextid } from './objectid'

RdfResource.factory.addMixin(PropertyShapeEx)

interface InitPropertyObjectShapeParams {
  shape: PropertyShape
  shouldEnableEditorChoice: ShouldEnableEditorChoice
  editors: EditorsState
}

export function initialiseObjectState({ shape, editors, shouldEnableEditorChoice }: InitPropertyObjectShapeParams, previous: PropertyState | undefined) {
  return (object?: GraphPointer): PropertyObjectState => {
    let matchedEditors = editors.matchSingleEditors({ shape, object })
    let selectedEditor

    const preferredEditorId = shape.get(dash.editor)?.id
    if (preferredEditorId?.termType === 'NamedNode') {
      const preferredEditor = Object.values(editors.singleEditors).find(e => e?.term.equals(preferredEditorId))
      selectedEditor = preferredEditorId
      if (preferredEditor) {
        matchedEditors.splice(matchedEditors.findIndex(e => e.term.equals(preferredEditor.term)), 1)
        matchedEditors = [{ ...preferredEditor, score: 100 }, ...matchedEditors]
      }
    } else {
      selectedEditor = matchedEditors[0]?.term
    }

    const previousObject = previous?.objects?.find(o => o.object?.term.equals(object?.term))
    if (previousObject?.selectedEditor && matchedEditors.some(e => e.term.equals(previousObject.selectedEditor))) {
      selectedEditor = previousObject.selectedEditor
    }

    return {
      key: nextid(),
      object,
      editors: matchedEditors,
      selectedEditor,
      editorSwitchDisabled: !shouldEnableEditorChoice({ object }),
      componentState: {},
    }
  }
}

interface InitPropertyShapeParams {
  focusNode: FocusNode
  shape: PropertyShape
  shouldEnableEditorChoice: ShouldEnableEditorChoice
  editors: EditorsState
}

function initialisePropertyShape(params: InitPropertyShapeParams, previous: PropertyState | undefined): PropertyState {
  const { shape } = params

  const values = shape.getValues(params.focusNode)

  const editors = params.editors.matchMultiEditors({ shape })

  const objects = values.map(initialiseObjectState(params, previous))
  while (shape.minCount && objects.length < shape.minCount) {
    objects.push(initialiseObjectState(params, previous)())
  }

  let datatype: NamedNode | undefined
  const shapeDatatype = shape.datatype
  if (shapeDatatype?.id.termType === 'NamedNode') {
    datatype = shapeDatatype.id
  }

  const editor = editors[0]
  const canRemove = canRemoveObject(shape, objects.length)
  const canAdd = canAddObject(shape, objects.length)

  let selectedEditor: NamedNode | undefined = editor?.term
  if (previous) {
    selectedEditor = previous.selectedEditor
  }

  return {
    shape,
    name: shape.displayName,
    editors,
    selectedEditor,
    objects,
    canRemove,
    canAdd,
    datatype,
    componentState: {},
  }
}

interface InitializePropertyShapesParams {
  editors: EditorsState
  focusNode: FocusNode
  selectedGroup?: string
  shouldEnableEditorChoice: ShouldEnableEditorChoice
}

export function initialisePropertyShapes(shape: NodeShape, { selectedGroup, ...params }: InitializePropertyShapesParams, previous: FocusNodeState | undefined) {
  const groupMap = new Map<string | undefined, PropertyGroupState>()

  const properties = shape.property
    .sort(byShOrder)
    .reduce<Array<PropertyState>>((map, prop) => {
    groupMap.set(prop.group?.id?.value, {
      group: prop.group,
      order: prop.group ? prop.group.order || 0 : -1,
      selected: prop.group?.id?.value === selectedGroup,
    })

    return [...map, initialisePropertyShape({
      ...params,
      shape: prop,
    }, previous?.properties?.find(p => p.shape.equals(prop)))]
  }, []).sort((l, r) => byShOrder(l.shape, r.shape))

  const groups = [...groupMap.values()].sort((l, r) => l.order - r.order)
  if (groups[0]) {
    groups[0].selected = true
  }

  return { groups, properties }
}

export interface InitializeParams {
  shapes: NodeShape[]
  shape?: NodeShape
  editors: EditorsState
  focusNode: FocusNode
  selectedGroup?: string
  shouldEnableEditorChoice: ShouldEnableEditorChoice
}

export function initialiseFocusNode(params: InitializeParams, previous: FocusNodeState | undefined): FocusNodeState {
  let { focusNode, shape } = params

  if (!params.shape && !params.shapes.length) {
    return {
      shapes: [],
      focusNode,
      groups: [],
      properties: [],
    }
  }

  const shapes = [...params.shapes]
  if (!shape) {
    [shape] = params.shapes
  } else if (shape && !shapes.find(s => s.equals(shape))) {
    shapes.unshift(shape)
  }

  const { properties, groups } = initialisePropertyShapes(shape, params, previous)

  return {
    shape,
    shapes,
    focusNode,
    groups,
    properties,
  }
}
