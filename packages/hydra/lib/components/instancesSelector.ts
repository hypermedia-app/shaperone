import type { InstancesSelectEditor } from '@hydrofoil/shaperone-core/components'
import type { ComponentDecorator } from '@hydrofoil/shaperone-core/models/components'
import type { MatcherDecorator } from '@hydrofoil/shaperone-core/models/editors'
import { dash, hydra } from '@tpluscode/rdf-ns-builders'
import type { RdfResourceCore } from '@tpluscode/rdfine/RdfResource'
import type { HydraClient, HydraResponse } from 'alcaeus/alcaeus'
import { fromPointer, IriTemplate } from '@rdfine/hydra/lib/IriTemplate'
import { DatasetCore } from 'rdf-js'
import RdfResourceImpl from '@tpluscode/rdfine'
import { IriTemplateBundle } from '@rdfine/hydra/bundles'
import { PropertyState } from '@hydrofoil/shaperone-core/models/forms'

RdfResourceImpl.factory.addMixin(...IriTemplateBundle)

declare module '@hydrofoil/shaperone-core/components' {
  interface InstancesSelect {
    searchUri?: string
  }

  interface InstancesSelectEditor {
    searchTemplate?({ property }: {property:PropertyState}): IriTemplate | null
  }
}

export const matcher: MatcherDecorator = {
  term: dash.InstancesSelectEditor,
  decorate({ match }) {
    return function (shape, value) {
      if (shape.pointer.out(hydra.collection).term?.termType === 'NamedNode') {
        return 1
      }
      if (shape.pointer.out(hydra.search).term) {
        return 1
      }
      return match(shape, value)
    }
  },
}

async function getClient(client?: Pick<HydraClient, 'loadResource'>) {
  return client || (await import('alcaeus/web')).Hydra
}

function getMembers(response: HydraResponse<DatasetCore, RdfResourceCore>) {
  const [collection] = response.representation?.ofType(hydra.Collection) || []
  if (collection) {
    return collection.pointer.out(hydra.member).toArray()
  }
  return []
}

export const decorator = (client?: Pick<HydraClient, 'loadResource'>): ComponentDecorator<InstancesSelectEditor> => ({
  applicableTo(component) {
    return component.editor.equals(dash.InstancesSelectEditor)
  },
  decorate(component: InstancesSelectEditor): InstancesSelectEditor {
    return {
      ...component,
      searchTemplate({ property }) {
        const searchTemplatePtr = property.shape.pointer.out(hydra.search)
        if (searchTemplatePtr.term) {
          return fromPointer(searchTemplatePtr as any)
        }
        return null
      },
      shouldLoad({ focusNode, value: { componentState }, property, updateComponentState }): boolean {
        const searchTemplate = this.searchTemplate?.({ property })
        if (searchTemplate) {
          const searchUri = searchTemplate.expand(focusNode)
          updateComponentState({
            searchUri,
          })

          return componentState.searchUri !== searchUri
        }

        return !componentState.instances
      },
      async loadInstance({ value }) {
        const alcaeus = await getClient(client)

        const { representation } = await alcaeus.loadResource(value.value)

        if (representation?.root) {
          return representation.root.pointer
        }

        return null
      },
      async loadChoices(args) {
        const collectionId = args.property.shape.get(hydra.collection)?.id
        if (collectionId && collectionId.termType === 'NamedNode') {
          const alcaeus = await getClient(client)
          const response = await alcaeus.loadResource(collectionId)
          return getMembers(response)
        }

        const searchTemplate = this.searchTemplate?.(args)
        if (searchTemplate) {
          const alcaeus = await getClient(client)
          const searchUri = searchTemplate.expand(args.focusNode)
          const response = await alcaeus.loadResource(searchUri)
          args.updateComponentState({
            searchUri,
          })
          return getMembers(response)
        }

        return component.loadChoices(args)
      },
    }
  },
})
