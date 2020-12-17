import { InstancesSelectEditor } from '@hydrofoil/shaperone-core/components'
import type { Decorator } from '@hydrofoil/shaperone-core/models/components'
import { SingleEditor } from '@hydrofoil/shaperone-core/models/editors'
import { dash, hydra } from '@tpluscode/rdf-ns-builders'
import type { HydraClient } from 'alcaeus/alcaeus'
import type { Collection } from 'alcaeus'

export const matcher: SingleEditor = {
  term: dash.InstancesSelectEditor,
  match(shape) {
    return shape.pointer.has(hydra.collection).terms.length ? 1 : 0
  },
}

export const decorator = (alcaeus: HydraClient): Decorator<InstancesSelectEditor> => ({
  applicableTo(component) {
    return component.editor.equals(dash.InstancesSelectEditor)
  },
  decorate(component: InstancesSelectEditor): InstancesSelectEditor {
    return {
      ...component,
      async loadChoices({ focusNode, property, updateComponentState }) {
        const collectionId = property.get(hydra.collection)?.id
        if (collectionId && collectionId.termType === 'NamedNode') {
          const response = await alcaeus.loadResource(collectionId)
          const [collection] = response.representation?.ofType<Collection>(hydra.Collection) || []
          if (collection) {
            updateComponentState({
              instances: collection.member.map(m => m.pointer),
            })
          }

          return
        }

        component.loadChoices({
          focusNode, property, updateComponentState,
        })
      },
    }
  },
})
