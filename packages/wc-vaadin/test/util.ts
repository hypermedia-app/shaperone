import { SingleEditorRenderParams, SingleEditorActions } from '@hydrofoil/shaperone-core/models/components'
import { PropertyObjectState } from '@hydrofoil/shaperone-core/models/forms'
import { PropertyShape, PropertyShapeMixin } from '@rdfine/shacl'
import * as sinon from 'sinon'
import { SingleContextClownface } from 'clownface'
import type { Initializer } from '@tpluscode/rdfine/RdfResource'
import { xsd } from '@tpluscode/rdf-ns-builders'

interface EditorTestParams {
  object: SingleContextClownface
  property?: Initializer<PropertyShape>
  datatype?: typeof xsd.integer
}

export function editorTestParams({ object, property, datatype }: EditorTestParams): { params: SingleEditorRenderParams; actions: SingleEditorActions } {
  const value: PropertyObjectState = {
    editors: [],
    selectedEditor: undefined,
    object,
  }

  return {
    params: {
      property: {
        canAdd: true,
        canRemove: true,
        name: 'foo',
        objects: [value],
        multiEditor: undefined,
        shape: new PropertyShapeMixin.Class(object.blankNode(), property),
        datatype,
      },
      value,
    },
    actions: {
      update: sinon.spy(),
      focusOnObjectNode: sinon.spy(),
    },
  }
}
