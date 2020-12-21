import type { InstancesSelectEditor } from '@hydrofoil/shaperone-core/components'
import type { ComponentDecorator } from '@hydrofoil/shaperone-core/models/components'
import type { MatcherDecorator } from '@hydrofoil/shaperone-core/models/editors'
import { dash, hydra } from '@tpluscode/rdf-ns-builders'
import type { HydraClient } from 'alcaeus/alcaeus'
import { NamedNode } from 'rdf-js'
import TermMap from '@rdf-esm/term-map'
import type { GraphPointer } from 'clownface'

export const matcher: MatcherDecorator = {
  term: dash.InstancesSelectEditor,
  decorate({ match }) {
    return function (shape, value) {
      if (shape.pointer.out(hydra.collection).term?.termType === 'NamedNode') {
        return 1
      }
      return match(shape, value)
    }
  },
}

const collections = new TermMap<NamedNode, Promise<GraphPointer[]>>()

export const decorator = (client?: Pick<HydraClient, 'loadResource'>): ComponentDecorator<InstancesSelectEditor> => ({
  applicableTo(component) {
    return component.editor.equals(dash.InstancesSelectEditor)
  },
  decorate(component: InstancesSelectEditor): InstancesSelectEditor {
    return {
      ...component,
      async loadInstance({ value }) {
        const alcaeus = client || (await import('alcaeus/web')).Hydra

        const { representation } = await alcaeus.loadResource(value.value)

        if (representation?.root) {
          return representation.root.pointer
        }

        return null
      },
      async loadChoices(args) {
        const collectionId = args.property.get(hydra.collection)?.id
        if (!(collectionId && collectionId.termType === 'NamedNode')) {
          return component.loadChoices(args)
        }

        if (!collections.has(collectionId)) {
          const alcaeus = client || (await import('alcaeus/web')).Hydra
          const promise = alcaeus.loadResource(collectionId)
            .then((response) => {
              const [collection] = response.representation?.ofType(hydra.Collection) || []
              if (collection) {
                return collection.pointer.out(hydra.member).toArray()
              }
              return []
            })

          collections.set(collectionId, promise)
        }

        return collections.get(collectionId)!
      },
    }
  },
})
