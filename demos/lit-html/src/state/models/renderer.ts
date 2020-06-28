import { createModel } from '@captaincodeman/rdx'
import { DefaultStrategy } from '@hydrofoil/shaperone-wc/renderer/DefaultStrategy'
import * as MaterialRenderStrategy from '@hydrofoil/shaperone-wc-material/renderer'
import { renderer, components } from '@hydrofoil/shaperone-wc/configure'
import { dash } from '@tpluscode/rdf-ns-builders'
import { Menu, updateMenu } from '../../menu'

export interface NestedShapesState {
  menu: Menu[]
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

const initialStrategy = {
  ...DefaultStrategy,
  ...MaterialRenderStrategy,
  focusNode: MaterialRenderStrategy.focusNode(DefaultStrategy.focusNode),
}

renderer.setStrategy(initialStrategy)

export const rendererSettings = createModel({
  state: <NestedShapesState>{
    menu: [layoutMenu, nestingMenu],
  },
  reducers: {
    checkNestingOption(state, { text }: Menu): NestedShapesState {
      return {
        ...state,
        menu: state.menu.map(menu => updateMenu(menu, 'renderer', text)),
      }
    },
    checkLayoutOption(state, { text }: Menu): NestedShapesState {
      return {
        ...state,
        menu: state.menu.map(menu => updateMenu(menu, 'layout', text)),
      }
    },
  },
  effects(store) {
    const dispatch = store.dispatch()

    return {
      async switchNesting({ text }: Menu) {
        if (text === 'Always one') {
          const { topmostFocusNodeFormRenderer } = await import('@hydrofoil/shaperone-playground-examples/NestedShapesIndividually/renderer')
          const nestingComponents = await import('@hydrofoil/shaperone-playground-examples/NestedShapesIndividually/components')

          renderer.setStrategy({
            form: topmostFocusNodeFormRenderer,
          })
          components.pushComponents(nestingComponents)
        } else {
          renderer.setStrategy({ form: initialStrategy.form })
          components.removeComponents([dash.CompoundEditor])
        }

        dispatch.rendererSettings.checkNestingOption({ text })
      },

      async switchLayout({ text }: Menu) {
        const strategy = {
          focusNode: initialStrategy.focusNode,
          group: initialStrategy.group,
        }

        if (text === 'Vaadin accordion') {
          const {
            AccordionGroupingRenderer,
            AccordionFocusNodeRenderer,
          } = await import('@hydrofoil/shaperone-wc-vaadin/renderer/accordion')

          strategy.group = AccordionGroupingRenderer
          strategy.focusNode = MaterialRenderStrategy.focusNode(AccordionFocusNodeRenderer)
        } else if (text === 'Material tabs') {
          const {
            TabsGroupRenderer,
            TabsFocusNodeRenderer,
          } = await import('@hydrofoil/shaperone-wc-material/renderer/tabs')

          strategy.group = TabsGroupRenderer
          strategy.focusNode = MaterialRenderStrategy.focusNode(TabsFocusNodeRenderer)
        }

        renderer.setStrategy(strategy)

        dispatch.rendererSettings.checkLayoutOption({ text })
      },
    }
  },
})
