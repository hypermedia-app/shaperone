import { NodeShape, PropertyShape } from '@rdfine/shacl'
import { shrink } from '@zazuko/rdf-vocabularies/shrink'
import { dash } from '@tpluscode/rdf-ns-builders'
import { NamedNode, Term } from 'rdf-js'
import { nanoid } from 'nanoid'
import type { FocusNodeState, PropertyGroupState, PropertyObjectState, PropertyState, ShouldEnableEditorChoice } from '../index'
import { FocusNode } from '../../../index'
import { byShOrder } from '../../../lib/order'
import { canAddObject, canRemoveObject } from './property'
import { getPathProperty } from '../../resources/lib/property'

interface InitPropertyObjectShapeParams {
  shape: PropertyShape
  shouldEnableEditorChoice: ShouldEnableEditorChoice
}

export function initialiseObjectState({ shape, shouldEnableEditorChoice }: InitPropertyObjectShapeParams, previous: PropertyState | undefined) {
  return (object: Term): PropertyObjectState => {
    let matchedEditors = matchEditors(shape, object, [])
    let selectedEditor

    const preferredEditorId = shape.get(dash.editor)?.id
    if (preferredEditorId?.termType === 'NamedNode') {
      const preferredEditor = [].find((e: any) => e.term.equals(preferredEditorId))
      selectedEditor = preferredEditorId
      if (preferredEditor) {
        matchedEditors.splice(matchedEditors.findIndex(e => e.term.equals(preferredEditor.term)), 1)
        matchedEditors = [{ ...preferredEditor, score: 100 }, ...matchedEditors]
      }
    } else {
      selectedEditor = matchedEditors[0]?.term
    }

    const previousObject = previous?.objects?.find(o => o.object.equals(object))
    if (previousObject?.selectedEditor) {
      selectedEditor = previousObject.selectedEditor
    }

    return {
      key: nanoid(),
      object,
      editors: matchedEditors,
      selectedEditor,
      editorSwitchDisabled: !shouldEnableEditorChoice({ object }),
    }
  }
}

interface InitPropertyShapeParams {
  focusNode: FocusNode
  shape: PropertyShape
  values: Term[]
  shouldEnableEditorChoice: ShouldEnableEditorChoice
}

function initialisePropertyShape(params: InitPropertyShapeParams, previous: PropertyState | undefined): PropertyState {
  const { shape, values } = params

  if (values.values.length === 0 && params.shape.minCount && params.shape.minCount > 0) {
    // values = defaultValue(params.shape, focusNode)
    // if (shape.defaultValue) {
    //   focusNode.addOut(getPathProperty(shape).id, values)
    // }
  }

  const editors: any[] = []

  const objects = values.map(initialiseObjectState(params, previous))

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

interface InitializePropertyShapesParams {
  focusNode: FocusNode
  selectedGroup?: string
  shouldEnableEditorChoice: ShouldEnableEditorChoice
}

export function initialisePropertyShapes(shape: NodeShape, params: InitializePropertyShapesParams, previous: FocusNodeState | undefined) {
  const { selectedGroup, focusNode, shouldEnableEditorChoice } = params
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
      focusNode,
      shape: prop,
      values: [], // focusNode.out(getPathProperty(prop).id),
      shouldEnableEditorChoice,
    }, previous?.properties?.find(p => p.shape.equals(prop)))]
  }, []).sort((l, r) => byShOrder(l.shape, r.shape))

  const groups = [...groupMap.values()].sort((l, r) => l.order - r.order)
  if (groups[0]) {
    groups[0].selected = true
  }

  return { groups, properties }
}

interface InitializeParams {
  shapes: NodeShape[]
  shape?: NodeShape
  focusNode: FocusNode
  selectedGroup?: string
  shouldEnableEditorChoice: ShouldEnableEditorChoice
}

function initialiseFocusNode(params: InitializeParams, previous: FocusNodeState | undefined): Partial<FocusNodeState> {
  const { focusNode, shapes } = params

  if (!params.shape && !shapes.length) {
    return {
      shapes: [],
      focusNode,
      groups: [],
      properties: [],
      label: '',
    }
  }

  const isMatch = () => false // getMatcher(focusNode)
  const { matchingShapes, otherShapes } = shapes.reduce(({ matchingShapes, otherShapes }, next) => {
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

  const { properties, groups } = initialisePropertyShapes(shape, params, previous)

  return {
    focusNode,
    groups,
    properties,
  }
}
