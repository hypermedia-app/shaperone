import rdfine from '@tpluscode/rdfine'
import type { SingleContextClownface } from 'clownface'
import type { BlankNode, NamedNode } from 'rdf-js'
import type { PropertyGroup, PropertyShape, Shape } from '@rdfine/shacl'
import { createModel, createStore, ModelStore } from '@captaincodeman/rdx'
import { PropertyMatcher } from './lib/propertyMatcher'
import { FormState } from './lib/FormState'
import * as reducers from './lib/formStateReducers'
import * as DashMatcher from './DashMatcher'

export { dash } from './lib/dash'

interface Renderer<TResult> {
  appendEditor(group: PropertyGroup, prop: PropertyShape, value?: SingleContextClownface): void
  getResult(): TResult
}

export type FocusNode = SingleContextClownface<BlankNode | NamedNode>

interface ChangeCallback {
  (resource: FocusNode, property: PropertyShape, value: any): void
}

export interface ChangeListener {
  onChange(cb: ChangeCallback): void
  notify(resource: FocusNode, property: PropertyShape, value: any): void
}

interface FormParams {
  shape: SingleContextClownface<NamedNode | BlankNode> | Shape
  focusNode: FocusNode
  matcher: PropertyMatcher
  validationReport?: any
  changeListener?: ChangeListener
}

const form = () => createModel({
  state: {
    matchers: [DashMatcher],
    focusNodes: {},
  },
  reducers,
  effects(store: ModelStore<{ form: FormState }>) {
    const dispatch = store.dispatch() as any

    return {
      async initAsync(params: { shape: SingleContextClownface | Shape; focusNode: FocusNode }) {
        const { focusNode } = params
        let shape: Shape

        if ('_context' in params.shape) {
          const { ShapeDependencies } = (await import('@rdfine/shacl/dependencies/Shape.js'))
          rdfine.factory.addMixin(...Object.values(ShapeDependencies))
          shape = rdfine.factory.createEntity(params.shape)
        } else {
          shape = params.shape
        }

        dispatch.form.initialize({
          shape,
          focusNode,
        })
      },
    }
  },
})

export const initialState = () => createStore({
  models: { form: form() },
})
