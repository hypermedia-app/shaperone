import TermSet from '@rdf-esm/term-set'
import { MultiselectComboBox } from 'multiselect-combo-box/multiselect-combo-box'
import prefixes from '@zazuko/rdf-vocabularies/prefixes'
import { State } from '../state/models/resource'
import { Menu } from '../menu'

const resourceMenuItem = (() => {
  import('@vaadin/vaadin-combo-box/vaadin-combo-box')

  const comboBox = document.createElement('vaadin-combo-box')
  comboBox.addEventListener('selected-item-changed', (e: any) => {
    comboBox.dispatchEvent(new CustomEvent('resource-selected', {
      detail: e.detail,
      bubbles: true,
      composed: true,
    }))
  })

  const menuItem = {
    text: 'Resource',
    children: [{
      component: comboBox,
    }],
  }

  return (state: State) => {
    const pointers = state.graph?.in().filter(node => ['NamedNode', 'BlankNode'].includes(node.term.termType))
    const terms = new TermSet(pointers?.map(node => node.term))

    comboBox.items = [...terms].map(node => node.value)
    comboBox.selectedItem = state.pointer?.value || ''

    return menuItem
  }
})()

const prefixesMenuItem = (() => {
  import('multiselect-combo-box/multiselect-combo-box')

  const combo = document.createElement('multiselect-combo-box') as MultiselectComboBox
  combo.items = Object.keys(prefixes)

  combo.addEventListener('change', (e: any) => {
    combo.dispatchEvent(new CustomEvent('prefixes-changed', {
      detail: {
        value: combo.selectedItems,
      },
      bubbles: true,
      composed: true,
    }))
  })

  const menuItem = {
    text: 'Prefixes',
    children: [{
      component: combo,
    }],
  }

  return (state: State) => {
    combo.selectedItems = state.prefixes

    return menuItem
  }
})()

const formatMenuItem = (() => {
  const menuItem: Menu = {
    text: 'Format',
  }

  return (state: State) => {
    menuItem.children = [{
      type: 'format',
      text: 'application/ld+json',
      checked: state.format === 'application/ld+json',
    }, {
      type: 'format',
      text: 'text/turtle',
      checked: state.format === 'text/turtle',
    }]

    return menuItem
  }
})()

export const resourceMenu = (state: State) => [
  resourceMenuItem(state),
  formatMenuItem(state),
  prefixesMenuItem(state),
]
