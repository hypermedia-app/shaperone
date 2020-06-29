import { createModel } from '@captaincodeman/rdx'
import { parsers } from '@rdf-esm/formats-common'
import toStream from 'string-to-stream'
import $rdf from 'rdf-ext'
import cf, { Clownface, SingleContextClownface } from 'clownface'
import { schema } from '@tpluscode/rdf-ns-builders'
import TermSet from '@rdfjs/term-set'
import { Shape } from '@rdfine/shacl'
import { DatasetCore } from 'rdf-js'
import type { ComboBoxElement } from '@vaadin/vaadin-combo-box/vaadin-combo-box'
import type { Store } from '../store'
import { Menu, updateComponent, updateMenu } from '../../menu'
import { serialize } from '../../serializer'

import '@vaadin/vaadin-combo-box/vaadin-combo-box'

const jsonld = {
  '@context': {
    '@vocab': schema().value,
    ex: 'http://example.com/',
  },
  '@id': 'ex:John_Doe',
  '@type': 'Person',
  name: 'John Doe',
  knows: {
    '@id': 'ex:Jane_Doe',
    '@type': 'Person',
    name: 'Janet',
  },
}

export interface State {
  graph?: Clownface
  pointer?: SingleContextClownface
  format: string
  serialized: string
  context: Record<string, any>
  menu: Menu[]
  resourceSelector?: ComboBoxElement
}

function createResourcesMenu() {
  const comboBox: ComboBoxElement = document.createElement('vaadin-combo-box')

  comboBox.addEventListener('selected-item-changed', (e: any) => {
    comboBox.dispatchEvent(new CustomEvent('resource-selected', {
      detail: e.detail,
      bubbles: true,
      composed: true,
    }))
  })

  return comboBox
}

export const resource = createModel({
  state: <State>{
    serialized: JSON.stringify(jsonld, null, 2),
    format: 'application/ld+json',
    context: {},
    menu: [{
      text: 'Resource',
      children: [{
        id: 'resource selector',
      }],
    }, {
      text: 'Format',
      children: [{
        type: 'format',
        text: 'application/ld+json',
        checked: true,
      }, {
        type: 'format',
        text: 'text/turtle',
      }],
    }],
  },
  reducers: {
    replaceGraph(state, { graph }: { graph: Clownface }) {
      const pointers = graph.in().filter(node => node.term.termType === 'NamedNode')
      const terms = new TermSet(pointers.map(node => node.term))
      let pointer
      const resourceSelector = state.resourceSelector || createResourcesMenu()

      if (!state.pointer) {
        pointer = graph.node($rdf.namedNode('http://example.com/John_Doe'))
      } else {
        pointer = graph.node(state.pointer.term)
      }

      resourceSelector.items = [...terms].map(node => node.value)
      resourceSelector.selectedItem = pointer.value
      return {
        ...state,
        graph,
        pointer,
        menu: state.menu.map(item => updateComponent(item, 'resource selector', resourceSelector)),
      }
    },
    selectResource(state, { id }: { id: string }) {
      if (id === state.pointer?.value) {
        return state
      }

      const { resourceSelector } = state
      if (resourceSelector) {
        resourceSelector.selectedItem = id
      }

      return {
        ...state,
        pointer: state.graph?.namedNode(id),
      }
    },
    serialized(state, serialized: string): State {
      return {
        ...state,
        serialized,
      }
    },
    context(state, context: Record<string, any>) {
      return {
        ...state,
        context,
      }
    },
    format(state, format: string) {
      return {
        ...state,
        format,
        menu: state.menu.map(item => updateMenu(item, 'format', format)),
      }
    },
  },
  effects(store: Store) {
    const dispatch = store.dispatch()
    return {
      async parse() {
        const { resource } = store.getState()

        const stream = parsers.import(resource.format, toStream(resource.serialized))
        if (!stream) {
          throw new Error('Failed to parse resource')
        }

        if (resource.format === 'application/ld+json') {
          try {
            const jsonld = JSON.parse(resource.serialized)
            dispatch.resource.context(jsonld['@context'])
            // eslint-disable-next-line no-empty
          } catch (e) {
          }
        }

        const dataset = await $rdf.dataset().import(stream)

        dispatch.resource.replaceGraph({
          graph: cf({ dataset }),
        })
      },

      async serialize({ dataset, shape } : { dataset: DatasetCore; shape: Shape }) {
        const { resource } = store.getState()

        dispatch.resource.serialized(await serialize(dataset, resource.format, {
          context: {
            '@context': { ...resource.context },
            '@type': shape.targetClass.id.value,
            '@embed': '@always',
          },
          compact: true,
          frame: true,
        }))
      },

      async changeFormat({ format, shape }: { format: Menu; shape?: Shape }) {
        const { resource } = store.getState()

        dispatch.resource.format(format.text)

        if (resource.pointer && shape) {
          dispatch.resource.serialize({
            dataset: resource.pointer.dataset,
            shape,
          })
        }
      },
    }
  },
})
