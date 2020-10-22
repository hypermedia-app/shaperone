import deepmerge from 'deepmerge'
import * as sinon from 'sinon'
import type { GraphPointer } from 'clownface'
import { PropertyShapeMixin } from '@rdfine/shacl'
import { ResourceNode } from '@tpluscode/rdfine/RdfResource'
import { FocusNodeState, FormState, PropertyObjectState, PropertyState, State } from '../../../models/forms/index'
import { MultiEditor, SingleEditor } from '../../../models/editors/index'
import { FocusNode } from '../../../index'

export type RecursivePartial<T> = {
  [P in keyof T]?:
  T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    // eslint-disable-next-line @typescript-eslint/ban-types
    T[P] extends object ? RecursivePartial<T[P]> :
      T[P];
};

interface Initializer {
  singleEditors?: SingleEditor[]
  form?: RecursivePartial<FormState>
}

let num = 0

export function testState(initializer: Initializer = {}) {
  num += 1
  const form = Symbol(num)

  const state = <State>{
    singleEditors: initializer.singleEditors || [],
    instances: new Map(),
  }

  state.instances.set(form, deepmerge<FormState>({
    shapes: [],
    focusStack: [],
    focusNodes: {},
  }, (initializer.form || {}) as any, { clone: false }))

  return { form, state }
}

export function testFocusNodeState(focusNode: FocusNode, initializer: Partial<FocusNodeState> = {}): Record<string, FocusNodeState> {
  return {
    [focusNode.value]: deepmerge<FocusNodeState>({
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

export function testPropertyState(pointer: ResourceNode, init: RecursivePartial<PropertyState> = {}): PropertyState {
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

export function testObjectState(object: GraphPointer, init: RecursivePartial<PropertyObjectState> = {}): PropertyObjectState {
  return deepmerge({
    selectedEditor: undefined,
    object,
    editors: [],
  }, init, { clone: false })
}
