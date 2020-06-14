import { Store } from '../../state'
import type { SingleContextClownface } from 'clownface'
import { Shape } from '@rdfine/shacl'
import { FocusNode } from '../../index'
import rdfine from '@tpluscode/rdfine'

export function effects(store: Store) {
  const dispatch = store.dispatch()

  return {
    updateResource(focusNode: FocusNode) {
      if (!focusNode) return

      if (focusNode.dataset !== store.getState().datasets.resource) {
        dispatch.datasets.replaceResource(focusNode)

        dispatch.form.initialize({ focusNode })
      }
    },

    async updateShape(shapeOrPointer: SingleContextClownface | Shape) {
      if (!shapeOrPointer) return

      let shape: Shape

      if ('_context' in shapeOrPointer) {
        const { ShapeDependencies } = (await import('@rdfine/shacl/dependencies/Shape.js'))
        rdfine.factory.addMixin(...Object.values(ShapeDependencies))
        shape = rdfine.factory.createEntity(shapeOrPointer)
      } else {
        shape = shapeOrPointer
      }

      await new Promise(resolve => {
        try {
          // eslint-disable-next-line no-new
          new EventTarget()
        } catch {
          const script = document.createElement('script')
          script.setAttribute('src', 'https://unpkg.com/@ungap/event-target@0.1.0/min.js')
          script.onload = resolve
          document.head.appendChild(script)
          return
        }

        resolve()
      })

      if (shape._selfGraph.dataset !== store.getState().datasets.shape) {
        dispatch.datasets.replaceShape(shape)

        dispatch.form.recalculateFocusNodes(shape)
      }
    },
  }
}
