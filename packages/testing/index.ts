import type { FocusNodeState, PropertyObjectState, PropertyState } from '@shaperone/core/models/forms/index.js'
import type { PropertyShape } from '@rdfine/shacl'
import type { AnyPointer, MultiPointer } from 'clownface'
import type { Initializer } from '@tpluscode/rdfine/RdfResource'
import type { NamedNode, Term } from '@rdfjs/types'
import { nextid } from '@shaperone/core/models/forms/lib/objectid.js'
import type { FocusNode } from '@shaperone/core'
import type { MultiEditorComponent, SingleEditorComponent } from 'shaperone'
import $rdf from './env.js'
import { propertyShape } from './util.js'

export { sinon } from './sinon.js'
export type { RecursivePartial } from '@shaperone/core/lib/RecursivePartial.js'

export const ex = $rdf.namespace('http://example.com/')

interface EditorTestParams {
  graph?: AnyPointer
  focusNode?: FocusNode
  property?: Initializer<PropertyShape>
}

type SingleEditorTestParams<C extends SingleEditorComponent = SingleEditorComponent> = Partial<Omit<C, 'focusNode' | 'property'>> & EditorTestParams & {
  object?: Term
  datatype?: NamedNode
  overrides?: MultiPointer
}

type MultiEditorTestParams<C extends MultiEditorComponent = MultiEditorComponent> = Partial<Omit<C, 'focusNode' | 'property'>> & EditorTestParams & {
  objects: Term[]
}

export interface SingleEditorTestFixture<C extends SingleEditorComponent = SingleEditorComponent> {
  value: PropertyObjectState
  property: PropertyState
  focusNode: FocusNodeState
}

export interface MultiEditorTestFixture<M extends MultiEditorComponent = MultiEditorComponent> {
  values: PropertyObjectState[]
  property: PropertyState
  focusNode: FocusNodeState
}

export function editorTestParams<C extends MultiEditorComponent = MultiEditorComponent>(arg?: MultiEditorTestParams<C>): MultiEditorTestFixture<C>
export function editorTestParams<C extends SingleEditorComponent = SingleEditorComponent>(arg?: SingleEditorTestParams<C>): SingleEditorTestFixture<C>
export function editorTestParams(
  arg: SingleEditorTestParams<any> | MultiEditorTestParams<any> = {},
): MultiEditorTestFixture | SingleEditorTestFixture {
  const graph = arg.graph || $rdf.clownface()
  const focusNode = arg.focusNode || graph.blankNode()

  const property: PropertyState = {
    canAdd: true,
    canRemove: true,
    name: 'foo',
    objects: [],
    editors: [],
    selectedEditor: undefined,
    shape: propertyShape(graph.blankNode(), arg.property),
    hidden: false,
    validationResults: [],
    hasErrors: false,
  }

  if ('objects' in arg) {
    const objects = arg.objects as Term[]
    const values = objects?.map(toState(graph)) || []

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
    object: object ? graph.node(object) : undefined,
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

function toState(graph: AnyPointer) {
  return (object: Term): PropertyObjectState => ({
    key: nextid(),
    editors: [],
    selectedEditor: undefined,
    object: graph.node(object),
    validationResults: [],
    hasErrors: false,
    nodeKind: undefined,
    overrides: undefined,
  })
}
