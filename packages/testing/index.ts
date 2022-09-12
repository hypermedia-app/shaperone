import {
  SingleEditorActions,
  SingleEditorRenderParams,
  ComponentInstance,
  MultiEditorActions,
  MultiEditorRenderParams,
} from '@hydrofoil/shaperone-core/models/components/index.js'
import { PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import type { PropertyShape } from '@rdfine/shacl'
import clownface, { GraphPointer } from 'clownface'
import type { Initializer } from '@tpluscode/rdfine/RdfResource'
import { NamedNode } from 'rdf-js'
import { nextid } from '@hydrofoil/shaperone-core/models/forms/lib/objectid.js'
import { FocusNode } from '@hydrofoil/shaperone-core'
import $rdf from '@rdf-esm/dataset'
import { rdfs } from '@tpluscode/rdf-ns-builders'
import namespace from '@rdf-esm/namespace'
import { propertyShape } from './util.js'
import { sinon } from './sinon.js'
import { objectRenderer, propertyRenderer } from './renderer.js'

export { sinon } from './sinon.js'
export type { RecursivePartial } from '@hydrofoil/shaperone-core/lib/RecursivePartial.js'

export const ex = namespace('http://example.com/')

interface EditorTestParams<T> {
  focusNode?: FocusNode
  object: GraphPointer
  property?: Initializer<PropertyShape>
  datatype?: NamedNode
  componentState?: T
}

export function editorTestParams<T extends ComponentInstance = ComponentInstance>(arg: EditorTestParams<T>): { params: SingleEditorRenderParams<T>; actions: SingleEditorActions } {
  const { object, datatype, componentState } = arg

  const focusNode = arg.focusNode || clownface({ dataset: $rdf.dataset() }).blankNode()

  const value: PropertyObjectState<T> = {
    key: nextid(),
    editors: [],
    selectedEditor: undefined,
    object,
    componentState: componentState || {} as T,
    validationResults: [],
    hasErrors: false,
  }

  const property: PropertyState = {
    canAdd: true,
    canRemove: true,
    name: 'foo',
    objects: [value],
    editors: [],
    selectedEditor: undefined,
    shape: propertyShape(object.blankNode(), arg.property),
    datatype,
    componentState: {},
    hidden: false,
    validationResults: [],
    hasErrors: false,
  }

  const renderer = objectRenderer({
    object: value,
    property,
    focusNode,
  })

  return {
    params: {
      form: {
        labelProperties: [rdfs.label],
        shouldEnableEditorChoice: () => true,
      },
      focusNode,
      property,
      value,
      componentState: value.componentState,
      updateComponentState: sinon.spy(),
      renderer,
    },
    actions: {
      update: sinon.spy(),
      clear: sinon.spy(),
      focusOnObjectNode: sinon.spy(),
      remove: sinon.spy(),
    },
  }
}

interface MultiEditorTestParams {
  focusNode?: FocusNode
  objects: GraphPointer[]
  property?: Initializer<PropertyShape>
}

export function multiEditorTestParams(arg: MultiEditorTestParams): { params: MultiEditorRenderParams; actions: MultiEditorActions } {
  const { objects } = arg

  const focusNode = arg.focusNode || clownface({ dataset: $rdf.dataset() }).blankNode()

  function toState(object: GraphPointer): PropertyObjectState {
    return {
      key: nextid(),
      editors: [],
      selectedEditor: undefined,
      object,
      componentState: {} as any,
      validationResults: [],
      hasErrors: false,
    }
  }

  const property: PropertyState = {
    canAdd: true,
    canRemove: true,
    name: 'foo',
    objects: objects.map(toState),
    editors: [],
    selectedEditor: undefined,
    shape: propertyShape(focusNode.blankNode(), arg.property),
    componentState: {} as any,
    hidden: false,
    validationResults: [],
    hasErrors: false,
  }

  const renderer = propertyRenderer({
    property,
    focusNode,
  })

  return {
    params: {
      form: {
        labelProperties: [rdfs.label],
        shouldEnableEditorChoice: () => true,
      },
      focusNode,
      property,
      updateComponentState: sinon.spy(),
      renderer,
      componentState: {} as any,
    },
    actions: {
      update: sinon.spy(),
    },
  }
}
