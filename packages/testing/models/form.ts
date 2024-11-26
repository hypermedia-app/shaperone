import deepmerge from 'deepmerge'
import sinon from 'sinon'
import type { GraphPointer } from 'clownface'
import type { ResourceNode } from '@tpluscode/rdfine/RdfResource'
import rdf from '@shaperone/testing/env.js'
import type { DatasetCoreFactory, NamedNode, DefaultGraph } from '@rdfjs/types'
import type * as Form from '@hydrofoil/shaperone-core/models/forms'
import type { ResourceState } from '@hydrofoil/shaperone-core/models/resources'
import type { MultiEditor, SingleEditor } from '@hydrofoil/shaperone-core/models/editors'
import type { FocusNode } from '@hydrofoil/shaperone-core'
import type { Dispatch, State, Store } from '@hydrofoil/shaperone-core/state'
import { ChangeNotifier } from '@hydrofoil/shaperone-core/models/resources/lib/notify.js'
import type { ShapeState } from '@hydrofoil/shaperone-core/models/shapes'
import type { RecursivePartial } from '../index.js'
import { blankNode } from '../nodeFactory.js'

interface Initializer {
  singleEditors?: SingleEditor[]
  form?: RecursivePartial<Form.FormState>
}

let num = 0

export const emptyGroupState = () => ({
  group: undefined,
  order: 1,
  selected: true,
})

export function testFormState(addToState?: Form.State, initializer: Initializer = {}) {
  num += 1
  const form = Symbol(num)

  const state = addToState || <Form.State> new Map()

  state.set(form, deepmerge<Form.FormState>({
    focusStack: [],
    focusNodes: {},
    shouldEnableEditorChoice: () => false,
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

export function testFocusNode(focusNode: FocusNode = blankNode(), initializer: Partial<Form.FocusNodeState> = {}) {
  return testFocusNodeState(focusNode, initializer)[focusNode.value]
}

export function testEditor(term: MultiEditor['term']): MultiEditor {
  return {
    term,
    match: sinon.spy(),
  }
}

export function testPropertyState(pointer: ResourceNode = blankNode(), init: RecursivePartial<Form.PropertyState> = {}): Form.PropertyState {
  const shape = rdf.rdfine.sh.PropertyShape(pointer)

  return deepmerge({
    editors: [],
    shape,
    name: 'property',
    canAdd: true,
    canRemove: true,
    selectedEditor: undefined,
    datatype: undefined,
    objects: [],
  }, init, {
    clone: false,
    customMerge(key: string) {
      if (key === 'shape') {
        return (_, property) => property
      }
      return undefined
    },
  })
}

let i = 0
export function testObjectState(object?: GraphPointer, init: RecursivePartial<Form.PropertyObjectState> = {}): Form.PropertyObjectState {
  return deepmerge({
    // eslint-disable-next-line no-plusplus
    key: `${++i}`,
    selectedEditor: undefined,
    object,
    editors: [],
    componentState: {},
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

interface TestStore {
  factory?: DatasetCoreFactory
  graph?: NamedNode | DefaultGraph
}

export function testStore({ graph = rdf.defaultGraph(), factory = rdf }: TestStore = {}): { form: symbol; store: Store } {
  const { form, state: forms } = testFormState()
  const dispatch = {
    env: new Proxy({}, spyHandler),
    forms: new Proxy({}, spyHandler),
    shapes: new Proxy({}, spyHandler),
    editors: new Proxy({}, spyHandler),
    resources: new Proxy({}, spyHandler),
    components: new Proxy({}, spyHandler),
    validation: new Proxy({}, spyHandler),
  }
  const resourcesState: ResourceState = {
    rootPointer: rdf.clownface({ dataset: factory.dataset(), graph }).blankNode(),
    get graph() {
      return this.rootPointer.any()
    },
    changeNotifier: sinon.createStubInstance(ChangeNotifier),
  }
  const shapesState: ShapeState = {
    shapes: [],
    shapesGraph: rdf.clownface({ dataset: factory.dataset() }),
  }
  const state: State = {
    shapes: new Map([[form, shapesState]]),
    resources: new Map([[form, resourcesState]]),
    editors: {
      singleEditors: {},
      allEditors: {},
      multiEditors: {},
      decorators: {},
      metadata: rdf.clownface({ dataset: factory.dataset() }),
      matchMultiEditors: () => [],
      matchSingleEditors: () => [],
    },
    forms,
    components: {
      components: {},
      decorators: [],
    },
    validation: {},
  }

  return {
    form,
    store: {
      getDispatch: (): Dispatch => dispatch,
      getState: () => state,
    },
  }
}
