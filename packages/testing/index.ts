import type { FocusNodeState, PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import type { PropertyShape } from '@rdfine/shacl'
import type { GraphPointer, MultiPointer } from 'clownface'
import type { Initializer } from '@tpluscode/rdfine/RdfResource'
import type { NamedNode } from '@rdfjs/types'
import { nextid } from '@hydrofoil/shaperone-core/models/forms/lib/objectid.js'
import type { FocusNode } from '@hydrofoil/shaperone-core'
import type { MultiEditorComponent, SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import $rdf from './env.js'
import { propertyShape } from './util.js'

export { sinon } from './sinon.js'
export type { RecursivePartial } from '@hydrofoil/shaperone-core/lib/RecursivePartial.js'

export const ex = $rdf.namespace('http://example.com/')

interface EditorTestParams {
  focusNode?: FocusNode
  property?: Initializer<PropertyShape>
}

type SingleEditorTestParams<C extends SingleEditorComponent = SingleEditorComponent> = Partial<Omit<C, 'focusNode' | 'property'>> & EditorTestParams & {
  object?: GraphPointer
  datatype?: NamedNode
  overrides?: MultiPointer
}

type MultiEditorTestParams<C extends MultiEditorComponent = MultiEditorComponent> = Partial<Omit<C, 'focusNode' | 'property'>> & EditorTestParams & {
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

export function editorTestParams<C extends MultiEditorComponent = MultiEditorComponent>(arg?: MultiEditorTestParams<C>): MultiEditorTestFixture
export function editorTestParams<C extends SingleEditorComponent = SingleEditorComponent>(arg?: SingleEditorTestParams<C>): SingleEditorTestFixture
export function editorTestParams(
  arg: SingleEditorTestParams<any> | MultiEditorTestParams<any> = {},
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
      ...arg,
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
    ...arg,
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
