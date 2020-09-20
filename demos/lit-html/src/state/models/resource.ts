import { createModel } from '@captaincodeman/rdx'
import $rdf from 'rdf-ext'
import cf, { AnyPointer, GraphPointer } from 'clownface'
import { schema, rdf, foaf } from '@tpluscode/rdf-ns-builders'
import TermSet from '@rdf-esm/term-set'
import type { ComboBoxElement } from '@vaadin/vaadin-combo-box/vaadin-combo-box'
import type { MultiselectComboBox } from 'multiselect-combo-box/multiselect-combo-box'
import { DatasetCore, Quad } from 'rdf-js'
import { prefixes } from '@zazuko/rdf-vocabularies'
import { Menu, updateComponent, updateMenu } from '../../menu'

import '@vaadin/vaadin-combo-box/vaadin-combo-box'
import 'multiselect-combo-box/multiselect-combo-box'

export interface State {
  graph: AnyPointer
  pointer: GraphPointer
  format: string
  prefixes: string
  menu: Menu[]
  resourceSelector: ComboBoxElement
  version: number
}

const graph = cf({ dataset: $rdf.dataset() })
const pointer = graph
  .namedNode('http://example.com/John_Doe')
  .addOut(rdf.type, schema.Person)
  .addOut(schema.name, 'John Doe')
  .addOut(foaf.gender, 'Male')
  .addOut(schema.knows, $rdf.namedNode('http://example.com/Jane_Doe'), (jane) => {
    jane.addOut(schema.name, 'Janet')
      .addOut(rdf.type, schema.Person)
  })

function populateResourcesMenu(resourceSelector: ComboBoxElement, graph: AnyPointer, selected?: GraphPointer) {
  const pointers = graph.in().filter(node => ['NamedNode', 'BlankNode'].includes(node.term.termType))
  const terms = new TermSet(pointers.map(node => node.term))

  // eslint-disable-next-line no-param-reassign
  resourceSelector.items = [...terms].map(node => node.value)

  let selectedItem: string
  if (selected) {
    selectedItem = selected.value
  } else {
    // eslint-disable-next-line prefer-destructuring
    selectedItem = (graph as any).has().values[0]
  }

  // eslint-disable-next-line no-param-reassign
  resourceSelector.selectedItem = selectedItem
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

  populateResourcesMenu(comboBox, graph, pointer)

  return comboBox
}

const defaultPrefixes = ['schema', 'foaf', 'vcard']
function createTextBox() {
  const tb = document.createElement('multiselect-combo-box') as MultiselectComboBox
  tb.items = Object.keys(prefixes)
  tb.selectedItems = defaultPrefixes

  tb.addEventListener('change', (e: any) => {
    tb.dispatchEvent(new CustomEvent('prefixes-changed', {
      detail: {
        value: tb.selectedItems.join(','),
      },
      bubbles: true,
      composed: true,
    }))
  })

  return tb
}

const resourceSelector = createResourcesMenu()

export const resource = createModel({
  state: <State>{
    graph,
    pointer,
    version: 0,
    format: 'application/ld+json',
    prefixes: defaultPrefixes.join(','),
    resourceSelector,
    menu: [{
      text: 'Resource',
      children: [{
        id: 'resource selector',
        component: resourceSelector,
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
    }, {
      text: 'Prefixes',
      children: [{
        component: createTextBox(),
      }],
    }],
  },
  reducers: {
    replaceGraph(state, { dataset, newVersion }: { dataset: Quad[] | DatasetCore; newVersion: boolean }) {
      const graph = Array.isArray(dataset) ? cf({ dataset: $rdf.dataset(dataset) }) : cf({ dataset })
      let pointer

      if (!state.pointer) {
        pointer = (graph as any).has().toArray()[0].value
      } else if (graph.node(state.pointer.term).out().values.length) {
        pointer = graph.node(state.pointer.term)
      } else {
        pointer = graph.namedNode('')
      }

      populateResourcesMenu(state.resourceSelector, graph, pointer)
      return {
        ...state,
        graph,
        pointer,
        version: newVersion ? state.version + 1 : state.version,
        menu: state.menu.map(item => updateComponent(item, 'resource selector', state.resourceSelector)),
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
        pointer: state.graph.in().toArray().find(term => term.value === id)!,
      }
    },
    setPrefixes(state, prefixes: string) {
      return {
        ...state,
        prefixes,
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
