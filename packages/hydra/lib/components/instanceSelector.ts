import type { InstancesSelectEditor } from '@hydrofoil/shaperone-core/components'
import type { ComponentDecorator } from '@hydrofoil/shaperone-core/models/components'
import type { SingleEditorDecorator } from '@hydrofoil/shaperone-core/models/editors'
import { dash, hydra } from '@tpluscode/rdf-ns-builders'
import type { HydraClient } from 'alcaeus/alcaeus'
import type { Collection } from 'alcaeus'

export const matcher: SingleEditorDecorator = {
  term: dash.InstancesSelectEditor,
  decorate({ match }) {
    return function (shape, property) {
      if (shape.pointer.has(hydra.collection).terms.length) {
        return 1
      }
      return match(shape, property)
    }
  },
}

export const decorator = (client?: Pick<HydraClient, 'loadResource'>): ComponentDecorator<InstancesSelectEditor> => ({
  applicableTo(component) {
    return component.editor.equals(dash.InstancesSelectEditor)
  },
  decorate(component: InstancesSelectEditor): InstancesSelectEditor {
    return {
      ...component,
      async loadChoices(args) {
        const collectionId = args.property.get(hydra.collection)?.id
        if (!(collectionId && collectionId.termType === 'NamedNode')) {
          component.loadChoices(args)
          return
        }

        if (args.componentState.loading) {
          return
        }

        args.updateComponentState({
          loading: true,
        })

        const alcaeus = client || (await import('alcaeus/web')).Hydra

        const response = await alcaeus.loadResource(collectionId)
        const [collection] = response.representation?.ofType<Collection>(hydra.Collection) || []
        if (collection) {
          args.updateComponentState({
            instances: collection.member.map(m => m.pointer),
            loading: false,
          })
        }
      },
    }
  },
})
