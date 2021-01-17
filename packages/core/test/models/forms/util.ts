import deepmerge from 'deepmerge'
import * as sinon from 'sinon'
import type { GraphPointer } from 'clownface'
import { fromPointer } from '@rdfine/shacl/lib/PropertyShape'
import { ResourceNode } from '@tpluscode/rdfine/RdfResource'
import clownface from 'clownface'
import { dataset } from '@rdf-esm/dataset'
import * as Form from '../../../models/forms/index'
import { ResourceState } from '../../../models/resources/index'
import { MultiEditor, SingleEditor } from '../../../models/editors/index'
import { FocusNode } from '../../../index'
import { Dispatch, State, Store } from '../../../state'
import { ChangeNotifier } from '../../../models/resources/lib/notify'
import { ShapeState } from '../../../models/shapes'

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

export function testEditor(term: MultiEditor['term']): MultiEditor {
  return {
    term,
    match: sinon.spy(),
  }
}

export function testPropertyState(pointer: ResourceNode, init: RecursivePartial<Form.PropertyState> = {}): Form.PropertyState {
  return deepmerge({
    editors: [],
    shape: fromPointer(pointer),
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

export function testObjectState(object?: GraphPointer, init: RecursivePartial<Form.PropertyObjectState> = {}): Form.PropertyObjectState {
  return deepmerge({
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
    rootPointer: clownface({ dataset: dataset() }).blankNode(),
    get graph() {
      return this.rootPointer.any()
    },
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
      decorators: {},
      metadata: clownface({ dataset: dataset() }),
      matchMultiEditors: () => [],
      matchSingleEditors: () => [],
    },
    forms,
    components: {
      components: {},
      decorators: [],
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
