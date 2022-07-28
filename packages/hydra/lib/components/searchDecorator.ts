import { HydraClient, HydraResponse } from 'alcaeus/alcaeus'
import { ComponentDecorator } from '@hydrofoil/shaperone-core/models/components'
import { InstancesSelectEditor } from '@hydrofoil/shaperone-core/lib/components/instancesSelect'
import { AutoCompleteEditor } from '@hydrofoil/shaperone-core/lib/components/autoComplete'
import { dash, hydra, sh } from '@tpluscode/rdf-ns-builders'
import { fromPointer, IriTemplate } from '@rdfine/hydra/lib/IriTemplate'
import { DatasetCore } from 'rdf-js'
import { RdfResourceCore } from '@tpluscode/rdfine/RdfResource'
import { FocusNode } from '@hydrofoil/shaperone-core'
import clownface, { MultiPointer } from 'clownface'
import { findNodes } from 'clownface-shacl-path'
import { PropertyState } from '@hydrofoil/shaperone-core/models/forms/index'
import { dataset } from '@rdf-esm/dataset'
import RdfResourceImpl from '@tpluscode/rdfine'
import { IriTemplateBundle } from '@rdfine/hydra/bundles'
import { hasAllRequiredVariables } from '../template'

RdfResourceImpl.factory.addMixin(...IriTemplateBundle)

interface SearchDecoratorState {
  /**
   * The search URL to dereference, constructed from a `hydra:search` template
   *
   * @category hydra
   */
  searchUri?: string
  /**
   * The previous dereferenced search URL
   *
   * @category hydra
   */
  lastLoaded?: string
}

interface SearchDecoratedEditor {
  /**
   * Gets the Hydra IRI Template resource from Property Shape
   *
   * @category hydra
   * @param property
   * @returns An [rdfine](https://npm.im/@tpluscode/rdfine) instance or null if property does not have a `hydra:search` template
   */
  searchTemplate?: ({ property }: {property:PropertyState}) => IriTemplate | undefined
}

declare module '@hydrofoil/shaperone-core/components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */

  interface InstancesSelect extends SearchDecoratorState {
  }

  interface InstancesSelectEditor extends SearchDecoratedEditor {
  }

  interface AutoComplete extends SearchDecoratorState {
  }

  interface AutoCompleteEditor extends SearchDecoratedEditor {
  }
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

const pendingRequests = new Map<string, Promise<any>>()
function load(client: Pick<HydraClient, 'loadResource'>, uri: string) {
  let request = pendingRequests.get(uri)
  if (request) {
    return request
  }

  request = client.loadResource(uri).then((response) => {
    pendingRequests.delete(uri)
    return response
  })
  pendingRequests.set(uri, request)
  return request
}

function getVariablesPointer(focusNode: FocusNode, template: IriTemplate): MultiPointer | undefined {
  const [path] = template.pointer.out(sh.path).toArray()

  return path ? findNodes(focusNode, path) : focusNode
}

function getSearchUri(searchTemplate: IriTemplate | undefined, focusNode: FocusNode, prop: PropertyState, freetextQuery: string | undefined): string | undefined {
  if (!searchTemplate) {
    return undefined
  }

  const freetextQueryVariable = searchTemplate.mapping
    .find(({ property }) => property?.equals(hydra.freetextQuery))
  if (freetextQueryVariable) {
    const freetextQueryMinLength = freetextQueryVariable.pointer.out(sh.minLength).value || '1'
    if (parseInt(freetextQueryMinLength || '1', 10) > (freetextQuery?.length || 0)) {
      return undefined
    }
  }

  const variables = getVariablesPointer(focusNode, searchTemplate)
  if (!variables || !hasAllRequiredVariables(searchTemplate, variables)) {
    return undefined
  }

  const freetextModel = clownface({ dataset: dataset() }).blankNode()
  if (freetextQuery) {
    freetextModel.addOut(hydra.freetextQuery, freetextQuery)
  }

  return searchTemplate.expand(variables, freetextModel)
}

type DecoratedEditor = InstancesSelectEditor | AutoCompleteEditor

/**
 * Creates a component decorator which overrides the base functionality by dereferencing remote Hydra Collection
 * resources for properties annotated with `hydra:collection` or `hydra:search`
 *
 * @param client instance of [Alcaeus Hydra client](https://alcaeus.hydra.how)
 */
export const decorator = (client?: Pick<HydraClient, 'loadResource'>): ComponentDecorator<DecoratedEditor> => ({
  applicableTo(component) {
    return component.editor.equals(dash.InstancesSelectEditor) || component.editor.equals(dash.AutoCompleteEditor)
  },
  decorate(component: DecoratedEditor): DecoratedEditor {
    return {
      ...component,
      searchTemplate({ property }) {
        const searchTemplatePtr = property.shape.pointer.out(hydra.search)
        if (searchTemplatePtr.term) {
          return fromPointer(searchTemplatePtr as any)
        }
        return undefined
      },
      shouldLoad({ focusNode, value: { componentState }, property, updateComponentState }): boolean {
        let freetextQuery: string | undefined
        if ('freetextQuery' in componentState) {
          freetextQuery = componentState.freetextQuery
        }

        const searchTemplate = this.searchTemplate?.({ property })
        const searchUri = getSearchUri(searchTemplate, focusNode, property, freetextQuery)
        if (searchTemplate) {
          if (!searchUri) {
            return false
          }

          updateComponentState({
            searchUri,
          })

          return componentState.lastLoaded !== searchUri
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
          const response = await load(alcaeus, collectionId.value)
          return getMembers(response)
        }

        const { lastLoaded, freetextQuery } = args.value.componentState
        const searchTemplate = this.searchTemplate?.(args)
        const searchUri = getSearchUri(searchTemplate, args.focusNode, args.property, freetextQuery)
        if (searchUri && searchUri !== lastLoaded) {
          const alcaeus = await getClient(client)
          const response = await load(alcaeus, searchUri)
          args.updateComponentState({
            lastLoaded: searchUri,
          })
          return getMembers(response)
        }

        return component.loadChoices(args)
      },
    }
  },
})
