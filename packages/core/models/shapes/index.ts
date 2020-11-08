import { createModel } from '@captaincodeman/rdx'
import { NodeShape } from '@rdfine/shacl'
import { AnyPointer } from 'clownface'
import { setGraph } from './reducers'
import type { Store } from '../../state'
import * as replaceFocusNodes from '../forms/reducers/replaceFocusNodes'
import { matchFor } from './lib'

export interface ShapeState {
  shapesGraph?: AnyPointer
  shapes: NodeShape[]
}

export type State = Map<symbol, ShapeState>

export const shapes = createModel({
  state: new Map() as State,
  reducers: {
    connect(map: State, form: symbol) {
      map.set(form, {
        shapes: [],
      })

      return map
    },
    setGraph,
  },
  effects(store: Store) {
    const dispatch = store.getDispatch()

    return {
      'forms/replaceFocusNodes': function ({ form }: replaceFocusNodes.Params) {
        const { forms, resources } = store.getState()
        const graph = resources.get(form)?.graph
        if (!graph) return

        const focusNodes = forms.instances.get(form)?.focusNodes || {}
        const shapes = store.getState().shapes.get(form)?.shapes || []
        if (!shapes.length) return

        Object.values(focusNodes).forEach(({ focusNode }) => {
          const matchingShapes = shapes.filter(matchFor(graph.node(focusNode)))

          dispatch.forms.selectShape({
            form,
            focusNode,
            shape: matchingShapes[0] || shapes[0],
          })
        })
      },
    }
  },
})
