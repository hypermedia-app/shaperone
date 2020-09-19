import { createModel } from '@captaincodeman/rdx'
import $rdf from 'rdf-ext'
import cf, { AnyPointer, GraphPointer } from 'clownface'
import { foaf, schema, vcard, xsd } from '@tpluscode/rdf-ns-builders'
import TermSet from '@rdf-esm/term-set'
import type { ComboBoxElement } from '@vaadin/vaadin-combo-box/vaadin-combo-box'
import { DatasetCore, Quad } from 'rdf-js'
import { Menu, updateComponent, updateMenu } from '../../menu'

import '@vaadin/vaadin-combo-box/vaadin-combo-box'

const jsonld = {
  '@context': {
    '@vocab': schema().value,
    foaf: `${foaf().value}`,
    vcard: `${vcard().value}`,
    xsd: `${xsd().value}`,
    ex: 'http://example.com/',
    gender: 'foaf:gender',
    langIso: 'http://lexvo.org/id/iso639-1/',
    language: {
      '@id': 'vcard:language',
      '@type': '@id',
    },
  },
  '@id': 'ex:John_Doe',
  '@type': 'Person',
  name: 'John Doe',
  gender: 'Male',
  knows: {
    '@id': 'ex:Jane_Doe',
    '@type': 'Person',
    name: 'Janet',
  },
}

export interface State {
  graph?: AnyPointer
  pointer?: GraphPointer
  format: string
  serialized: string
  context: Record<string, any>
  menu: Menu[]
  resourceSelector?: ComboBoxElement
  version: number
}

function createResourcesMenu() {
  const comboBox = document.createElement('vaadin-combo-box') as ComboBoxElement

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
    version: 0,
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
    replaceGraph(state, dataset: Quad[] | DatasetCore) {
      const graph = Array.isArray(dataset) ? cf({ dataset: $rdf.dataset(dataset) }) : cf({ dataset })

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
        version: state.version + 1,
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
})
