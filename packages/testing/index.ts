import {
  SingleEditorActions,
  SingleEditorRenderParams,
  ComponentInstance,
} from '@hydrofoil/shaperone-core/models/components'
import { PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import type { PropertyShape } from '@rdfine/shacl'
import clownface, { GraphPointer } from 'clownface'
import type { Initializer } from '@tpluscode/rdfine/RdfResource'
import { NamedNode } from 'rdf-js'
import { nextid } from '@hydrofoil/shaperone-core/models/forms/lib/objectid'
import { FocusNode } from '@hydrofoil/shaperone-core'
import $rdf from '@rdf-esm/dataset'
import { rdfs } from '@tpluscode/rdf-ns-builders'
import namespace from '@rdf-esm/namespace'
import { propertyShape } from './util'
import { sinon } from './sinon'
import { objectRenderer } from './renderer'

export { sinon } from './sinon'
export type { RecursivePartial } from '@hydrofoil/shaperone-core/lib/RecursivePartial'

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
        languages: ['en'],
        labelProperties: [rdfs.label],
        shouldEnableEditorChoice: () => true,
      },
      focusNode,
      property,
      value,
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
