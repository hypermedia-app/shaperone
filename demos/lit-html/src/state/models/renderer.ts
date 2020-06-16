import { createModel } from '@captaincodeman/rdx'
import { EditorFactory } from '@hydrofoil/shaperone-wc/components'
import type { Renderer } from '@hydrofoil/shaperone-wc/renderer'
import { DefaultStrategy } from '@hydrofoil/shaperone-wc/renderer'
import * as MaterialRenderStrategy from '@hydrofoil/shaperone-wc-material/renderer'
import * as AccordionRenderStrategy from '@hydrofoil/shaperone-wc-vaadin/renderer/accordion'
import * as MaterialTabsRenderStrategy from '@hydrofoil/shaperone-wc-material/renderer/tabs'
import * as nestingComponents from '@hydrofoil/shaperone-playground-examples/NestedShapesIndividually/components'
import * as nestingRenderer from '@hydrofoil/shaperone-playground-examples/NestedShapesIndividually/renderer'
import { Menu, updateMenu } from '../../menu'

export interface NestedShapesState {
  components?: Record<string, EditorFactory>
  strategy: Renderer['strategy']
  menu: Menu
}

const layoutMenu: Menu = {
  text: 'Layout',
  children: [{
    text: 'No grouping',
    type: 'layout',
    checked: true,
  }, {
    text: 'Material tabs',
    type: 'layout',
  }, {
    text: 'Vaadin accordion',
    type: 'layout',
  }],
}

const nestingMenu: Menu = {
  text: 'Nested shapes',
  children: [{
    text: 'Disabled',
    checked: true,
    type: 'renderer',
  }, {
    text: 'Always one',
    type: 'renderer',
  }],
}

const initialStrategy = { ...DefaultStrategy, ...MaterialRenderStrategy }

export const renderer = createModel({
  state: <NestedShapesState>{
    strategy: initialStrategy,
    menu: {
      text: 'Options',
      children: [layoutMenu, nestingMenu],
    },
  },
  reducers: {
    switchNesting(state, { text }: Menu) {
      let components: Record<string, EditorFactory> | undefined
      const strategy = {
        ...state.strategy,
        form: initialStrategy.form,
      }

      if (text === 'Always one') {
        components = nestingComponents
        strategy.form = nestingRenderer.topmostFocusNodeFormRenderer
      }

      return {
        ...state,
        strategy,
        components,
        menu: updateMenu(state.menu, 'renderer', text),
      }
    },
    switchLayout(state, { text }: Menu) {
      const strategy = {
        ...state.strategy,
        focusNode: initialStrategy.focusNode,
        group: initialStrategy.group,
      }

      if (text === 'Vaadin accordion') {
        strategy.group = AccordionRenderStrategy.AccordionGroupingRenderer
        strategy.focusNode = AccordionRenderStrategy.AccordionFocusNodeRenderer
      } else if (text === 'Material tabs') {
        strategy.group = MaterialTabsRenderStrategy.TabsGroupRenderer
        strategy.focusNode = MaterialTabsRenderStrategy.TabsFocusNodeRenderer
      }

      return {
        ...state,
        strategy,
        menu: updateMenu(state.menu, 'layout', text),
      }
    },
  },
})
