import type { FocusNodeState, PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import type { PropertyShape } from '@rdfine/shacl'
import type { GraphPointer, MultiPointer } from 'clownface'
import type { Initializer } from '@tpluscode/rdfine/RdfResource'
import type { NamedNode } from '@rdfjs/types'
import { nextid } from '@hydrofoil/shaperone-core/models/forms/lib/objectid.js'
import type { FocusNode } from '@hydrofoil/shaperone-core'
import $rdf from './env.js'
import { propertyShape } from './util.js'

export { sinon } from './sinon.js'
export type { RecursivePartial } from '@hydrofoil/shaperone-core/lib/RecursivePartial.js'

export const ex = $rdf.namespace('http://example.com/')

interface EditorTestParams {
  focusNode?: FocusNode
  property?: Initializer<PropertyShape>
}

interface SingleEditorTestParams extends EditorTestParams {
  object?: GraphPointer
  datatype?: NamedNode
  overrides?: MultiPointer
}

interface MultiEditorTestParams extends EditorTestParams {
  objects: GraphPointer[]
}

export interface SingleEditorTestFixture {
  value: PropertyObjectState
  property: PropertyState
  focusNode: FocusNodeState
}

export interface MultiEditorTestFixture {
  values: PropertyObjectState[]
  property: PropertyState
  focusNode: FocusNodeState
}

export function editorTestParams(arg?: MultiEditorTestParams): MultiEditorTestFixture
export function editorTestParams(arg?: SingleEditorTestParams): SingleEditorTestFixture
export function editorTestParams(
  arg: SingleEditorTestParams | MultiEditorTestParams = {},
): MultiEditorTestFixture | SingleEditorTestFixture {
  const focusNode = arg.focusNode || $rdf.clownface().blankNode()

  const property: PropertyState = {
    canAdd: true,
    canRemove: true,
    name: 'foo',
    objects: [],
    editors: [],
    selectedEditor: undefined,
    shape: propertyShape(focusNode.blankNode(), arg.property),
    hidden: false,
    validationResults: [],
    hasErrors: false,
  }

  if ('objects' in arg) {
    const { objects } = arg
    const values = objects?.map(toState) || []

    return <MultiEditorTestFixture>{
      focusNode: {
        focusNode,
      },
      property,
      values,
    }
  }
  const { object, datatype, overrides } = arg

  const value: PropertyObjectState = {
    key: nextid(),
    editors: [],
    selectedEditor: undefined,
    object,
    validationResults: [],
    hasErrors: false,
    nodeKind: undefined,
    overrides,
  }

  property.objects = [value]
  property.datatype = datatype

  return <SingleEditorTestFixture>{
    focusNode: {
      focusNode,
    },
    property,
    value,
  }
}

function toState(object: GraphPointer): PropertyObjectState {
  return {
    key: nextid(),
    editors: [],
    selectedEditor: undefined,
    object,
    validationResults: [],
    hasErrors: false,
    nodeKind: undefined,
    overrides: undefined,
  }
}
