import type { InstancesSelectEditor } from '@hydrofoil/shaperone-core/components'
import type { ComponentDecorator } from '@hydrofoil/shaperone-core/models/components'
import type { MatcherDecorator } from '@hydrofoil/shaperone-core/models/editors'
import { dash, hydra, sh } from '@tpluscode/rdf-ns-builders'
import type { RdfResourceCore } from '@tpluscode/rdfine/RdfResource'
import type { HydraClient, HydraResponse } from 'alcaeus/alcaeus'
import { fromPointer, IriTemplate } from '@rdfine/hydra/lib/IriTemplate'
import { DatasetCore } from 'rdf-js'
import RdfResourceImpl from '@tpluscode/rdfine'
import { IriTemplateBundle } from '@rdfine/hydra/bundles'
import { PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import { FocusNode } from '@hydrofoil/shaperone-core'
import type { GraphPointer } from 'clownface'
import { findNodes } from 'clownface-shacl-path'
import clownface from 'clownface'
import { dataset } from '@rdf-esm/dataset'
import { hasAllRequiredVariables } from '../template'

RdfResourceImpl.factory.addMixin(...IriTemplateBundle)

declare module '@hydrofoil/shaperone-core/components' {
  interface InstancesSelect {
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

  interface InstancesSelectEditor {
    /**
     * Gets the Hydra IRI Template resource from Property Shape
     *
     * @category hydra
     * @param property
     * @returns An [rdfine](https://npm.im/@tpluscode/rdfine) instance or null if property does not have a `hydra:search` template
     */
    searchTemplate?: ({ property }: {property:PropertyState}) => IriTemplate | undefined
  }
}

/**
 * Extends `dash:InstancesSelectEditor` to value hydra-backed properties higher
 *
 * @returns `1` when `?shape hydra:collection ?any` or `?shape hydra:search ?any`
 * @returns base matcher otherwise
 */
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

function getVariablesNode(focusNode: FocusNode, template: IriTemplate): GraphPointer | undefined {
  const [path] = template.pointer.out(sh.path).toArray()

  const candidates = path ? findNodes(focusNode, path).toArray() : [focusNode]
  return candidates.find(node => hasAllRequiredVariables(template, node))
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

  const variablesNode = getVariablesNode(focusNode, searchTemplate)
  if (!variablesNode) {
    return undefined
  }

  const freetextModel = clownface({ dataset: dataset() }).blankNode()
  if (freetextQuery) {
    freetextModel.addOut(hydra.freetextQuery, freetextQuery)
  }

  return searchTemplate.expand(variablesNode, freetextModel)
}

/**
 * Creates a component decorator which overrides the base functionality by dereferencing remote Hydra Collection
 * resources for properties annotated with `hydra:collection` or `hydra:search`
 *
 * @param client instance of [Alcaeus Hydra client](https://alcaeus.hydra.how)
 */
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
        return undefined
      },
      shouldLoad({ focusNode, value: { componentState }, property, updateComponentState }, freetextQuery): boolean {
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
      async loadChoices(args, freetextQuery) {
        const collectionId = args.property.shape.get(hydra.collection)?.id
        if (collectionId && collectionId.termType === 'NamedNode') {
          const alcaeus = await getClient(client)
          const response = await load(alcaeus, collectionId.value)
          return getMembers(response)
        }

        const { lastLoaded } = args.value.componentState
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

        return component.loadChoices(args, freetextQuery)
      },
    }
  },
})
