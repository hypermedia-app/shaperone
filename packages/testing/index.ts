import { SingleEditorActions, SingleEditorRenderParams } from '@hydrofoil/shaperone-core/models/components'
import { PropertyObjectState } from '@hydrofoil/shaperone-core/models/forms'
import type { PropertyShape } from '@rdfine/shacl'
import * as _sinon from 'sinon'
import { GraphPointer } from 'clownface'
import type { Initializer } from '@tpluscode/rdfine/RdfResource'
import { NamedNode } from 'rdf-js'
import { propertyShape } from '@hydrofoil/shaperone-core/test/util'
import { nextid } from '@hydrofoil/shaperone-core/models/forms/lib/objectid'

export const sinon = _sinon

interface EditorTestParams<T> {
  object: GraphPointer
  property?: Initializer<PropertyShape>
  datatype?: NamedNode
  componentState?: T
}

export function editorTestParams<T extends Record<string, any> = Record<string, any>>(arg: EditorTestParams<T>): { params: SingleEditorRenderParams<T>; actions: SingleEditorActions } {
  const { object, property, datatype, componentState } = arg

  const value: PropertyObjectState<T> = {
    key: nextid(),
    editors: [],
    selectedEditor: undefined,
    object,
    componentState: componentState || {} as T,
  }

  return {
    params: {
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
