import { GraphPointer } from 'clownface'
import type { Store } from '../../../../state'
import * as updateObject from '../../../forms/reducers/updateObject'
import { notify } from '../../lib/notify'
import { deleteOrphanedSubgraphs } from '../../../../lib/graph'

type Params = Omit<updateObject.SetObjectParams, 'object'> & {
  object: {
    object?: GraphPointer
  }
}

export default function (store: Store) {
  return function ({ form, focusNode, property, object, newValue }: Params) {
    const { resources } = store.getState()
    const state = resources.get(form)
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
      for (const quad of newValue.dataset) {
        focusNodePointer.dataset.add(quad)
      }
    }

    focusNodePointer.addOut(pathProperty, newValue)

    notify({
      store,
      form,
      property,
      focusNode,
    })
  }
}
