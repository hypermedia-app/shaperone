import { Store } from '../../state'
import type { SingleContextClownface } from 'clownface'
import { Shape } from '@rdfine/shacl'
import { FocusNode } from '../../index'
import rdfine from '@tpluscode/rdfine'
import type { Mixin } from '@tpluscode/rdfine/lib/ResourceFactory'
import { EditorsState } from '../../editors/index'

async function loadMixins(): Promise<Mixin[]> {
  const deps = [
    import('@rdfine/shacl/dependencies/Shape.js').then(s => s.ShapeDependencies),
    import('@rdfine/shacl/dependencies/PropertyGroup.js').then(s => s.PropertyGroupDependencies),
  ]

  const mixins = await Promise.all(deps)

  return mixins.reduce<Mixin[]>((flat, mixins) => {
    return [
      ...flat,
      ...Object.values(mixins),
    ]
  }, [])
}

export function effects(store: Store) {
  const dispatch = store.dispatch()

  return {
    // todo: read editors from store
    updateResource({ focusNode, editors }: { focusNode: FocusNode; editors: EditorsState }) {
      if (!focusNode) return

      if (focusNode.dataset !== store.getState().datasets.resource) {
        dispatch.datasets.replaceResource(focusNode)

        dispatch.form.initialize({ focusNode, editors })
      }
    },

    // todo: read editors from store
    async updateShape({ shapeOrPointer, editors }: { shapeOrPointer: SingleContextClownface | Shape; editors: EditorsState }) {
      if (!shapeOrPointer) return

      let shape: Shape

      const mixins = await loadMixins()
      rdfine.factory.addMixin(...mixins)
      if ('_context' in shapeOrPointer) {
        shape = rdfine.factory.createEntity(shapeOrPointer)
      } else {
        shape = shapeOrPointer
      }

      if (shape._selfGraph.dataset !== store.getState().datasets.shape) {
        dispatch.datasets.replaceShape(shape)

        dispatch.form.recalculateFocusNodes({ shape, editors })
      }
    },
  }
}
