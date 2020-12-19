import deepmerge from 'deepmerge'
import * as sinon from 'sinon'
import $rdf from 'rdf-ext'
import type { AnyPointer, GraphPointer } from 'clownface'
import { PropertyShapeMixin } from '@rdfine/shacl'
import { ResourceNode } from '@tpluscode/rdfine/RdfResource'
import clownface from 'clownface'
import { dataset } from '@rdf-esm/dataset'
import * as Form from '../../../models/forms/index'
import { ResourceState } from '../../../models/resources/index'
import { EditorsState, MultiEditor, SingleEditor } from '../../../models/editors/index'
import { FocusNode } from '../../../index'
import { Dispatch, State, Store } from '../../../state'
import { ChangeNotifier } from '../../../models/resources/lib/notify'
import { ShapeState } from '../../../models/shapes'
import { mapEditors } from '../editors/util'
import { matchMultiEditors, matchSingleEditors } from '../../../models/editors/lib/match'

export type RecursivePartial<T> = {
  [P in keyof T]?:
  T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    // eslint-disable-next-line @typescript-eslint/ban-types
    T[P] extends object ? RecursivePartial<T[P]> :
      T[P];
};

interface Initializer {
  singleEditors?: SingleEditor[]
  form?: RecursivePartial<Form.FormState>
}

let num = 0

export function testState(initializer: Initializer = {}, addToState?: Form.State) {
  num += 1
  const form = Symbol(num)

  const state = addToState || <Form.State> new Map()

  state.set(form, deepmerge<Form.FormState>({
    focusStack: [],
    focusNodes: {},
  }, (initializer.form || {}) as any, { clone: false }))

  return { form, state }
}

export function testFocusNodeState(focusNode: FocusNode, initializer: Partial<Form.FocusNodeState> = {}): Record<string, Form.FocusNodeState> {
  return {
    [focusNode.value]: deepmerge<Form.FocusNodeState>({
      focusNode,
      groups: [],
      properties: [],
      shapes: [],
    }, initializer, { clone: false }),
  }
}

export function testEditor(term: MultiEditor['term']): MultiEditor {
  return {
    term,
    match: sinon.spy(),
  }
}

interface EditorsInitializer {
  singleEditors?: SingleEditor[]
  multiEditors?: MultiEditor[]
  metadata?: (metadata: AnyPointer) => AnyPointer
  matchSingleEditors?: (...args: Parameters<typeof matchSingleEditors>) => RecursivePartial<ReturnType<typeof matchSingleEditors>>
  matchMultiEditors?: (...args: Parameters<typeof matchMultiEditors>) => RecursivePartial<ReturnType<typeof matchMultiEditors>>
}

export function testEditorsState({
  metadata = p => p,
  matchSingleEditors = () => [],
  matchMultiEditors = () => [],
  ...initialize
}: EditorsInitializer = {}): EditorsState {
  const singleEditors = initialize.singleEditors?.reduce(mapEditors, {}) || {}
  const multiEditors = initialize.multiEditors?.reduce(mapEditors, {}) || {}

  return {
    singleEditors,
    multiEditors,
    allEditors: {
      ...singleEditors,
      ...multiEditors,
    },
    metadata: metadata(clownface({ dataset: $rdf.dataset() })),
    matchSingleEditors: sinon.stub().callsFake(matchSingleEditors),
    matchMultiEditors: sinon.stub().callsFake(matchMultiEditors),
  }
}

export function testPropertyState(pointer: ResourceNode, init: RecursivePartial<Form.PropertyState> = {}): Form.PropertyState {
  return deepmerge({
    editors: [],
    shape: new PropertyShapeMixin.Class(pointer),
    name: 'property',
    canAdd: true,
    canRemove: true,
    selectedEditor: undefined,
    datatype: undefined,
    objects: [],
  }, init, { clone: false })
}

export function testObjectState(object: GraphPointer, init: RecursivePartial<Form.PropertyObjectState> = {}): Form.PropertyObjectState {
  return deepmerge({
    selectedEditor: undefined,
    object,
    editors: [],
  }, init, { clone: false })
}

const spyHandler: ProxyHandler<any> = {
  get(target: any, p: PropertyKey): any {
    if (!target[p]) {
      target[p] = sinon.stub()
    }

    return target[p]
  },
}

export function testStore(): { form: symbol; store: Store } {
  const { form, state: forms } = testState()
  const dispatch = {
    forms: new Proxy({}, spyHandler),
    shapes: new Proxy({}, spyHandler),
    editors: new Proxy({}, spyHandler),
    resources: new Proxy({}, spyHandler),
    components: new Proxy({}, spyHandler),
  }
  const resourcesState: ResourceState = {
    graph: clownface({ dataset: dataset() }),
    changeNotifier: sinon.createStubInstance(ChangeNotifier),
  }
  const shapesState: ShapeState = {
    shapes: [],
    shapesGraph: clownface({ dataset: dataset() }),
  }
  const state: State = {
    shapes: new Map([[form, shapesState]]),
    resources: new Map([[form, resourcesState]]),
    editors: {
      singleEditors: {},
      allEditors: {},
      multiEditors: {},
      metadata: clownface({ dataset: dataset() }),
      matchMultiEditors: () => [],
      matchSingleEditors: () => [],
    },
    forms,
    components: {
    },
  }

  return {
    form,
    store: {
      getDispatch: (): Dispatch => dispatch,
      getState: () => state,
    },
  }
}
