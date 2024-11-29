import type { HydraResponse } from 'alcaeus/alcaeus.js'
import type { ComponentDecorator } from '@hydrofoil/shaperone-core/models/components'
import type { InstancesSelectEditor } from '@hydrofoil/shaperone-core/lib/components/instancesSelect.js'
import type { AutoCompleteEditor } from '@hydrofoil/shaperone-core/lib/components/autoComplete.js'
import { dash, hydra, sh } from '@tpluscode/rdf-ns-builders'
import type { IriTemplate } from '@rdfine/hydra/lib/IriTemplate'
import type { DatasetCore } from '@rdfjs/types'
import type { RdfResourceCore } from '@tpluscode/rdfine/RdfResource'
import type { FocusNode } from '@hydrofoil/shaperone-core'
import type { MultiPointer } from 'clownface'
import { findNodes } from 'clownface-shacl-path'
import type { PropertyState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import type { ShaperoneEnvironment } from '@hydrofoil/shaperone-core/env.js'

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
  searchTemplate?: ({ env, property }: { env: ShaperoneEnvironment; property:PropertyState}) => IriTemplate | undefined
}

declare module '@hydrofoil/shaperone-core/components.js' {
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

function getMembers(response: HydraResponse<DatasetCore, RdfResourceCore>) {
  const [collection] = response.representation?.ofType(hydra.Collection) || []
  if (collection) {
    return collection.pointer.out(hydra.member).toArray()
  }
  return []
}

const pendingRequests = new Map<string, Promise<any>>()
function load(env: ShaperoneEnvironment, uri: string) {
  let request = pendingRequests.get(uri)
  if (request) {
    return request
  }

  request = env.hydra.loadResource(uri).then((response) => {
    pendingRequests.delete(uri)
    return response
  })
  pendingRequests.set(uri, request)
  return request
}

function getVariablesPointer(focusNode: FocusNode, template: IriTemplate): MultiPointer {
  const [path] = template.pointer.out(sh.path).toArray()

  return path ? findNodes(focusNode, path) : focusNode
}

function getSearchUri(env: ShaperoneEnvironment, searchTemplate: IriTemplate | undefined, focusNode: FocusNode, prop: PropertyState, freetextQuery: string | undefined): string | undefined {
  if (!searchTemplate) {
    return undefined
  }

  const variableSource = getVariablesPointer(focusNode, searchTemplate)
  if (!variableSource.terms.length) {
    return undefined
  }

  const variables = env.clownface().blankNode()
  for (const mapping of searchTemplate.mapping) {
    const { property } = mapping
    if (property) {
      if (property.equals(hydra.freetextQuery)) {
        const freetextQueryMinLength = mapping.pointer.out(sh.minLength).value || '1'
        if (parseInt(freetextQueryMinLength || '1', 10) > (freetextQuery?.length || 0)) {
          return undefined
        }
        if (freetextQuery) {
          variables.addOut(hydra.freetextQuery, freetextQuery)
        }
      } else {
        let path = mapping.pointer.out(sh.path)
        if (!path.term) {
          path = property.pointer
        }
        const { terms } = findNodes(variableSource, path)
        if (mapping.required && !terms.length) {
          return undefined
        }
        variables.addOut(property.pointer, terms)
      }
    }
  }

  return searchTemplate.expand(variables)
}

type DecoratedEditor = InstancesSelectEditor | AutoCompleteEditor

/**
 * Creates a component decorator which overrides the base functionality by dereferencing remote Hydra Collection
 * resources for properties annotated with `hydra:collection` or `hydra:search`
 *
 */
export const decorator: ComponentDecorator<DecoratedEditor> = {
  applicableTo(component) {
    return component.editor.equals(dash.InstancesSelectEditor) || component.editor.equals(dash.AutoCompleteEditor)
  },
  decorate(component: DecoratedEditor): DecoratedEditor {
    return {
      ...component,
      searchTemplate({ property, env }) {
        const searchTemplatePtr = property.shape.pointer.out(hydra.search)
        if (searchTemplatePtr.term) {
          return env.rdfine.hydra.IriTemplate(searchTemplatePtr as any)
        }
        return undefined
      },
      shouldLoad({ env, focusNode, componentState, property, updateComponentState }): boolean {
        let freetextQuery: string | undefined
        if ('freetextQuery' in componentState) {
          freetextQuery = componentState.freetextQuery
        }

        const searchTemplate = this.searchTemplate?.({ env, property })
        const searchUri = getSearchUri(env, searchTemplate, focusNode, property, freetextQuery)
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
      async loadInstance({ env, value }) {
        const { representation } = await env.hydra.loadResource(value.value)

        if (representation?.root) {
          return representation.root.pointer
        }

        return null
      },
      async loadChoices(args) {
        const collectionId = args.property.shape.get(hydra.collection)?.id
        if (collectionId && collectionId.termType === 'NamedNode') {
          const response = await load(args.env, collectionId.value)
          return getMembers(response)
        }

        const { lastLoaded, freetextQuery } = args.componentState
        const searchTemplate = this.searchTemplate?.(args)
        const searchUri = getSearchUri(args.env, searchTemplate, args.focusNode, args.property, freetextQuery)
        if (searchUri && searchUri !== lastLoaded) {
          const response = await load(args.env, searchUri)
          args.updateComponentState({
            lastLoaded: searchUri,
          })
          return getMembers(response)
        }

        return component.loadChoices(args)
      },
    }
  },
}
