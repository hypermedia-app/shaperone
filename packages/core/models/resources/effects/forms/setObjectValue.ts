import type { GraphPointer } from 'clownface'
import type { Store } from '../../../../state/index.js'
import type * as updateObject from '../../../forms/reducers/updateObject.js'
import { deleteOrphanedSubgraphs } from '../../../../lib/graph.js'

type Params = Omit<updateObject.SetObjectParams, 'object'> & {
  object: {
    object?: GraphPointer
  }
}

export default function (store: Store) {
  return function ({ focusNode, property, object, newValue }: Params) {
    const { resources } = store.getState()
    const state = resources
    const pathProperty = property.getPathProperty(true).id
    if (!state?.graph) {
      return
    }

    if ('termType' in newValue) {
      if (newValue.equals(object.object?.term)) {
        return
      }
    }

    const focusNodePointer = state.graph.node(focusNode)
    if (object.object) {
      const children = focusNodePointer.out(pathProperty).toArray()
      focusNodePointer.deleteOut(pathProperty, object.object)
      deleteOrphanedSubgraphs(children)
    }
    if ('dataset' in newValue) {
      for (const { subject, predicate, object } of newValue.dataset) {
        focusNodePointer.node(subject).addOut(predicate, object)
      }
    }

    focusNodePointer.addOut(pathProperty, newValue)

    store.getDispatch().form.notify({
      property,
      focusNode,
    })
  }
}
