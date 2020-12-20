import {
  SingleEditorActions,
  SingleEditorRenderParams,
  TComponentState,
} from '@hydrofoil/shaperone-core/models/components'
import { PropertyObjectState } from '@hydrofoil/shaperone-core/models/forms'
import type { PropertyShape } from '@rdfine/shacl'
import * as _sinon from 'sinon'
import clownface, { GraphPointer } from 'clownface'
import type { Initializer } from '@tpluscode/rdfine/RdfResource'
import { NamedNode } from 'rdf-js'
import { propertyShape } from '@hydrofoil/shaperone-core/test/util'
import { nextid } from '@hydrofoil/shaperone-core/models/forms/lib/objectid'
import { FocusNode } from '@hydrofoil/shaperone-core'
import $rdf from '@rdf-esm/dataset'
import { rdfs } from '@tpluscode/rdf-ns-builders'
import namespace from '@rdf-esm/namespace'

export const sinon = _sinon

export const ex = namespace('http://example.com/')

interface EditorTestParams<T> {
  focusNode?: FocusNode
  object: GraphPointer
  property?: Initializer<PropertyShape>
  datatype?: NamedNode
  componentState?: T
}

export function editorTestParams<T extends TComponentState = TComponentState>(arg: EditorTestParams<T>): { params: SingleEditorRenderParams<T>; actions: SingleEditorActions<T> } {
  const { focusNode, object, property, datatype, componentState } = arg

  const value: PropertyObjectState<T> = {
    key: nextid(),
    editors: [],
    selectedEditor: undefined,
    object,
    componentState: componentState || {} as T,
  }

  return {
    params: {
      form: {
        languages: ['en'],
        labelProperties: [rdfs.label],
        shouldEnableEditorChoice: () => true,
      },
      focusNode: focusNode || clownface({ dataset: $rdf.dataset() }).blankNode(),
      property: {
        canAdd: true,
        canRemove: true,
        name: 'foo',
        objects: [value],
        editors: [],
        selectedEditor: undefined,
        shape: propertyShape(object.blankNode(), property),
        datatype,
        componentState: {},
      },
      value,
    },
    actions: {
      update: sinon.spy(),
      focusOnObjectNode: sinon.spy(),
      updateComponentState: sinon.spy(),
    },
  }
}
