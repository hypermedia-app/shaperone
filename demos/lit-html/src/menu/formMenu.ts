import { ComponentsState } from '../state/models/components'
import { RendererState } from '../state/models/renderer'
import { componentSets } from '../configure'
import { Menu } from '../menu'

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

function rendererMenu(renderer: RendererState): Menu[] {
  return [
    {
      text: 'Layout',
      children: [{
        text: 'No grouping',
        checked: renderer.grouping === 'none',
        type: 'layout',
        id: 'none' as RendererState['grouping'],
      }, {
        text: 'Material tabs',
        checked: renderer.grouping === 'material tabs',
        type: 'layout',
        id: 'material tabs' as RendererState['grouping'],
      }, {
        text: 'Vaadin accordion',
        checked: renderer.grouping === 'vaadin accordion',
        type: 'layout',
        id: 'vaadin accordion' as RendererState['grouping'],
      }],
    }, {
      text: 'Nested shapes',
      children: [{
        text: 'Disabled',
        checked: renderer.nesting === 'none',
        id: 'none' as RendererState['nesting'],
        type: 'renderer',
      }, {
        text: 'Always one',
        checked: renderer.nesting === 'always one',
        id: 'always one' as RendererState['nesting'],
        type: 'renderer',
      }],
    }]
}

export function formMenu(components: ComponentsState, renderer: RendererState) {
  return [
    componentsMenu(components),
    ...rendererMenu(renderer),
  ]
}
