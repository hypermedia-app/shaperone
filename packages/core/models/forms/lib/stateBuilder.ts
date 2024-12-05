import type { NodeShape, PropertyShape } from '@rdfine/shacl'
import type { GraphPointer } from 'clownface'
import type { NamedNode } from '@rdfjs/types'
import type { EditorsState } from '../../editors/index.js'
import type { ComponentsState } from '../../components/index.js'
import type { FocusNodeState, PropertyGroupState, PropertyObjectState, PropertyState, ShouldEnableEditorChoice } from '../index.js'
import type { FocusNode } from '../../../index.js'
import { byShOrder } from '../../../lib/order.js'
import { canAddObject, canRemoveObject, combineProperties } from './property.js'
import { nextid } from './objectid.js'

interface InitPropertyObjectShapeParams {
  shape: PropertyShape
  shouldEnableEditorChoice: ShouldEnableEditorChoice
  editors: EditorsState
  components: ComponentsState
}

export function initialiseObjectState({ shape, editors, components, shouldEnableEditorChoice }: InitPropertyObjectShapeParams, previous: PropertyState | undefined) {
  return (object?: GraphPointer): PropertyObjectState => {
    const matchedEditors = editors.matchSingleEditors({ shape, object })
    let selectedEditor = matchedEditors.filter(editor => components.components[editor.term.value])[0]?.term || matchedEditors[0]?.term

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
      validationResults: [],
      hasErrors: false,
      nodeKind: undefined,
      overrides: undefined,
    }
  }
}

interface InitPropertyShapeParams {
  focusNode: FocusNode
  shape: PropertyShape
  shouldEnableEditorChoice: ShouldEnableEditorChoice
  editors: EditorsState
  components: ComponentsState
}

export function initialisePropertyShape(params: InitPropertyShapeParams, previous: PropertyState | undefined): PropertyState {
  const { shape, components } = params

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

  const editor = editors.filter(({ term }) => term.value in components.components)[0]
  const canRemove = canRemoveObject(shape, objects.length)
  const canAdd = canAddObject(shape, objects.length)

  let selectedEditor: NamedNode | undefined = editor?.term
  if (previous) {
    selectedEditor = previous.selectedEditor
  }

  const hidden = typeof previous?.hidden !== 'undefined'
    ? previous.hidden
    : shape.hidden || false

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
    hidden,
    validationResults: [],
    hasErrors: false,
  }
}

interface InitializePropertyShapesParams {
  editors: EditorsState
  focusNode: FocusNode
  selectedGroup?: string
  shouldEnableEditorChoice: ShouldEnableEditorChoice
  components: ComponentsState
}

export function initialisePropertyShapes(shape: NodeShape, { selectedGroup, ...params }: InitializePropertyShapesParams, previous: FocusNodeState | undefined) {
  const groupMap = new Map<string | undefined, PropertyGroupState>()

  const { logicalConstraints, ...result } = combineProperties(shape)

  const properties = result.properties
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

  return { groups, properties, logicalConstraints }
}

export interface InitializeParams {
  shapes: NodeShape[]
  shape?: NodeShape
  editors: EditorsState
  focusNode: FocusNode
  selectedGroup?: string
  shouldEnableEditorChoice: ShouldEnableEditorChoice
  components: ComponentsState
}

export function initialiseFocusNode(params: InitializeParams, previous: FocusNodeState | undefined): FocusNodeState {
  let { focusNode, shape } = params

  if (!params.shape && !params.shapes.length) {
    return {
      shapes: [],
      focusNode,
      groups: [],
      properties: [],
      validationResults: [],
      hasErrors: false,
      logicalConstraints: { and: [], or: [], xone: [] },
    }
  }

  const shapes = [...params.shapes]
  if (!shape) {
    [shape] = params.shapes
  } else if (shape && !shapes.find(s => s.equals(shape))) {
    shapes.unshift(shape)
  }

  const { properties, groups, logicalConstraints } = initialisePropertyShapes(shape, params, previous)

  return {
    shape,
    shapes,
    focusNode,
    groups,
    properties,
    validationResults: [],
    hasErrors: false,
    logicalConstraints,
  }
}
