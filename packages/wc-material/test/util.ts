import { SingleEditorActions, SingleEditorRenderParams } from '@hydrofoil/shaperone-core/models/components'
import { PropertyObjectState } from '@hydrofoil/shaperone-core/models/forms'
import { PropertyShape, PropertyShapeMixin } from '@rdfine/shacl'
import * as sinon from 'sinon'
import { GraphPointer } from 'clownface'
import type { Initializer } from '@tpluscode/rdfine/RdfResource'
import { NamedNode } from 'rdf-js'

interface EditorTestParams {
  object: GraphPointer
  property?: Initializer<PropertyShape>
  datatype?: NamedNode
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
        editors: [],
        selectedEditor: undefined,
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
