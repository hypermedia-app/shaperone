import {
  SingleEditorActions,
  SingleEditorRenderParams,
  ComponentInstance, MultiEditorActions, MultiEditorRenderParams,
} from '@hydrofoil/shaperone-core/models/components/index.js'
import { PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import type { PropertyShape } from '@rdfine/shacl'
import clownface, { GraphPointer, MultiPointer } from 'clownface'
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
  property?: Initializer<PropertyShape>
  componentState?: T
}

interface SingleEditorTestParams<T> extends EditorTestParams<T> {
  object?: GraphPointer
  datatype?: NamedNode
  overrides?: MultiPointer
}

interface MultiEditorTestParams<T> extends EditorTestParams<T> {
  objects: GraphPointer[]
}

interface MultiEditorTestFixture<T> {
  params: MultiEditorRenderParams<T>
  actions: MultiEditorActions
}

interface SingleEditorTestFixture<T>{
  params: SingleEditorRenderParams<T>
  actions: SingleEditorActions
}

export function editorTestParams<T extends ComponentInstance = ComponentInstance>(arg?: MultiEditorTestParams<T>): MultiEditorTestFixture<T>
export function editorTestParams<T extends ComponentInstance = ComponentInstance>(arg?: SingleEditorTestParams<T>): SingleEditorTestFixture<T>
export function editorTestParams<T extends ComponentInstance = ComponentInstance>(
  arg: SingleEditorTestParams<T> | MultiEditorTestParams<T> = {},
): MultiEditorTestFixture<T> | SingleEditorTestFixture<T> {
  const { componentState } = arg

  const focusNode = arg.focusNode || clownface({ dataset: $rdf.dataset() }).blankNode()

  const property: PropertyState = {
    canAdd: true,
    canRemove: true,
    name: 'foo',
    objects: [],
    editors: [],
    selectedEditor: undefined,
    shape: propertyShape(focusNode.blankNode(), arg.property),
    componentState: {},
    hidden: false,
    validationResults: [],
    hasErrors: false,
  }

  if ('objects' in arg) {
    const { objects } = arg
    property.objects = objects?.map(toState) || []
    const renderer = propertyRenderer({
      property,
      focusNode,
    })

    return <MultiEditorTestFixture<T>>{
      params: {
        form: {
          labelProperties: [rdfs.label],
          shouldEnableEditorChoice: () => true,
        },
        focusNode,
        property,
        updateComponentState: sinon.spy(),
        renderer,
        componentState: componentState || {} as T,
      },
      actions: {
        update: sinon.spy(),
      },
    }
  }
  const { object, datatype, overrides } = arg

  const value: PropertyObjectState<T> = {
    key: nextid(),
    editors: [],
    selectedEditor: undefined,
    object,
    componentState: componentState || {} as T,
    validationResults: [],
    hasErrors: false,
    nodeKind: undefined,
    overrides,
  }

  property.objects = [value]
  property.datatype = datatype

  const renderer = objectRenderer({
    object: value,
    property,
    focusNode,
  })

  return <SingleEditorTestFixture<T>>{
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

function toState(object: GraphPointer): PropertyObjectState {
  return {
    key: nextid(),
    editors: [],
    selectedEditor: undefined,
    object,
    componentState: {} as any,
    validationResults: [],
    hasErrors: false,
    nodeKind: undefined,
    overrides: undefined,
  }
}
