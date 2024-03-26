import { html, render } from 'lit'
import { ComponentsState } from '../state/models/components.js'
import { RendererState } from '../state/models/renderer.js'
import { componentSets } from '../configure.js'
import { Menu } from '../menu.js'

function componentsMenu(components: ComponentsState): Menu {
  return {
    text: 'Components',
    children: [...Object.keys(componentSets).map<Menu>(name => ({
      text: name,
      checked: name === components.components,
      type: 'components',
    })), {
      component: 'hr',
    }, {
      text: 'Disable editor choice',
      checked: components.disableEditorChoice,
      type: 'editorChoice',
    }],
  }
}

const menuItem = (() => {
  const items = new Map<string, HTMLElement>()

  return function menuItem(title: string, subtext: string, checked: boolean) {
    let item = items.get(title)
    if (!item) {
      item = document.createElement('vaadin-context-menu-item')
      items.set(title, item)
    }

    if (checked) {
      item.setAttribute('menu-item-checked', '')
    } else {
      item.removeAttribute('menu-item-checked')
    }

    render(html`<div>${title}</div><div><small>${subtext}</small></div>`, item)

    return item
  }
})()

function rendererMenu(renderer: RendererState): Menu[] {
  const labCount = Object.values(renderer.labs || {}).filter(lab => lab).length
  const labBadgeCode = labCount === 0 ? 0x24ff : 0x2775 + labCount

  return [
    {
      text: 'Layout',
      children: [{
        text: 'No grouping',
        checked: renderer.grouping === 'none',
        type: 'layout',
        id: 'none',
      }, {
        text: 'Material tabs',
        checked: renderer.grouping === 'material tabs',
        type: 'layout',
        id: 'material tabs',
      }, {
        text: 'Vaadin accordion',
        checked: renderer.grouping === 'vaadin accordion',
        type: 'layout',
        id: 'vaadin accordion',
      }],
    }, {
      text: 'Nested shapes',
      children: [{
        text: 'Disabled',
        checked: renderer.nesting === 'none',
        id: 'none',
        type: 'renderer',
      }, {
        text: 'Always one',
        checked: renderer.nesting === 'always one',
        id: 'always one',
        type: 'renderer',
      }, {
        text: 'Nested',
        checked: renderer.nesting === 'inline',
        id: 'inline',
        type: 'renderer',
      }],
    }, {
      text: `Labs (${String.fromCharCode(labBadgeCode)})`,
      children: [{
        component: menuItem(
          'Error summary',
          'Display additional errors on top',
          renderer.labs?.errorSummary === true,
        ),
        id: 'errorSummary',
        type: 'labs',
      }, {
        component: menuItem(
          'sh:xone selector menus',
          'May require reload when disabled',
          renderer.labs?.xone === true,
        ),
        id: 'xone',
        type: 'labs',
      }],
    }]
}

export function formMenu(components: ComponentsState, renderer: RendererState) {
  return [
    componentsMenu(components),
    ...rendererMenu(renderer),
  ]
}
