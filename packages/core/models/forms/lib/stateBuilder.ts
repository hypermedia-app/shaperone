import { NodeShape, PropertyShape } from '@rdfine/shacl'
import type { MultiPointer, GraphPointer } from 'clownface'
import { shrink } from '@zazuko/rdf-vocabularies/shrink'
import { dash, rdfs } from '@tpluscode/rdf-ns-builders'
import { NamedNode } from 'rdf-js'
import { ResourceNode } from '@tpluscode/rdfine/RdfResource'
import type { MultiEditor, SingleEditor, SingleEditorMatch, Editor } from '../../editors'
import type { FocusNodeState, PropertyGroupState, PropertyObjectState, PropertyState, ShouldEnableEditorChoice } from '../index'
import { FocusNode } from '../../../index'
import { byShOrder } from '../../../lib/order'
import { canAddObject, canRemoveObject } from './property'
import { getPathProperty } from '../../../lib/property'
import { matchFor } from './shapes'
import { defaultValue } from './defaultValue'

export function matchEditors(shape: PropertyShape, object: GraphPointer, editors: Editor<SingleEditor>[]): SingleEditorMatch[] {
  return editors.map(editor => ({ ...editor, score: editor.match(shape, object) }))
    .filter(match => match.score === null || match.score > 0)
    .sort((left, right) => {
      const leftScore = left.score || 0
      const rightScore = right.score || 0

      return rightScore - leftScore
    })
}

interface InitPropertyObjectShapeParams {
  shape: PropertyShape
  editors: Editor<SingleEditor>[]
  shouldEnableEditorChoice: ShouldEnableEditorChoice
}

export function initialiseObjectState({ shape, editors, shouldEnableEditorChoice }: InitPropertyObjectShapeParams, previous: PropertyState | undefined) {
  return (object: GraphPointer): PropertyObjectState => {
    let matchedEditors = matchEditors(shape, object, editors)
    let selectedEditor

    const preferredEditorId = shape.get(dash.editor)?.id
    if (preferredEditorId?.termType === 'NamedNode') {
      const preferredEditor = editors.find(e => e.term.equals(preferredEditorId))
      selectedEditor = preferredEditorId
      if (preferredEditor) {
        matchedEditors.splice(matchedEditors.findIndex(e => e.term.equals(preferredEditor.term)), 1)
        matchedEditors = [{ ...preferredEditor, score: 100 }, ...matchedEditors]
      }
    } else {
      selectedEditor = matchedEditors[0]?.term
    }

    const previousObject = previous?.objects?.find(o => o.object.term.equals(object.term))
    if (previousObject?.selectedEditor) {
      selectedEditor = previousObject.selectedEditor
    }

    return {
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
  editors: Editor<SingleEditor>[]
  multiEditors: Editor<MultiEditor>[]
  values: MultiPointer
  shouldEnableEditorChoice: ShouldEnableEditorChoice
}

function initialisePropertyShape(params: InitPropertyShapeParams, previous: PropertyState | undefined): PropertyState {
  let { focusNode, shape, values } = params

  if (values.values.length === 0 && params.shape.minCount && params.shape.minCount > 0) {
    values = defaultValue(params.shape, focusNode)
    if (shape.defaultValue) {
      focusNode.addOut(getPathProperty(shape).id, values)
    }
  }

  const editors = params.multiEditors
    .map(editor => ({ editor, score: editor.match(shape) }))
    .filter(match => match.score === null || match.score > 0)
    .map(e => e.editor) || []

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
  editors: Editor<SingleEditor>[]
  multiEditors: Editor<MultiEditor>[]
  focusNode: FocusNode
  selectedGroup?: string
  shouldEnableEditorChoice: ShouldEnableEditorChoice
}

export function initialisePropertyShapes(shape: NodeShape, params: InitializePropertyShapesParams, previous: FocusNodeState | undefined) {
  const { selectedGroup, editors, multiEditors, focusNode, shouldEnableEditorChoice } = params
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
      editors,
      multiEditors,
      values: focusNode.out(getPathProperty(prop).id),
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
  editors: Editor<SingleEditor>[]
  multiEditors: Editor<MultiEditor>[]
  focusNode: FocusNode
  selectedGroup?: string
  shouldEnableEditorChoice: ShouldEnableEditorChoice
}

interface FocusNodeInitOptions {
  getMatcher?(focusNode: ResourceNode): (shape: NodeShape) => boolean
}

export function initialiseFocusNode(params: InitializeParams, previous: FocusNodeState | undefined, { getMatcher = matchFor }: FocusNodeInitOptions = {}): FocusNodeState {
  const { focusNode, shapes } = params

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

  const { properties, groups } = initialisePropertyShapes(shape, params, previous)

  return {
    shape,
    matchingShapes,
    shapes: [...matchingShapes, ...otherShapes],
    focusNode,
    groups,
    properties,
    label: focusNode.out(rdfs.label).value || 'Resource',
  }
}
