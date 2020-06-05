import { createModel, ModelStore } from '@captaincodeman/rdx'
import * as DashMatcher from '../DashMatcher'
import * as reducers from './reducers'
import { FormState } from '../state'
import type { SingleContextClownface } from 'clownface'
import { Shape } from '@rdfine/shacl'
import { FocusNode } from '../index'
import rdfine from '@tpluscode/rdfine'

export const form = createModel({
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
