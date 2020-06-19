import { createModel } from '@captaincodeman/rdx'
import { DefaultStrategy } from '@hydrofoil/shaperone-wc/renderer/DefaultStrategy'
import * as MaterialRenderStrategy from '@hydrofoil/shaperone-wc-material/renderer'
import { Menu, updateMenu } from '../../menu'
import { store as sharedStore } from '@hydrofoil/shaperone-wc/store'

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

const initialStrategy = { ...DefaultStrategy, ...MaterialRenderStrategy }

// todo: expose as a configuration module
sharedStore.dispatch.renderer.setStrategy(initialStrategy)

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
        const strategy = {
          form: initialStrategy.form,
        }

        if (text === 'Always one') {
          const { topmostFocusNodeFormRenderer } = await import('@hydrofoil/shaperone-playground-examples/NestedShapesIndividually/renderer')
          strategy.form = topmostFocusNodeFormRenderer
        }
        const nestingComponents = await import('@hydrofoil/shaperone-playground-examples/NestedShapesIndividually/components')

        // todo: expose as a configuration module
        sharedStore.dispatch.renderer.setStrategy(strategy)
        sharedStore.dispatch.components.pushComponents(nestingComponents)

        sharedStore.dispatch.renderer.loadDependencies()

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
          strategy.focusNode = AccordionFocusNodeRenderer
        } else if (text === 'Material tabs') {
          const {
            TabsGroupRenderer,
            TabsFocusNodeRenderer,
          } = await import('@hydrofoil/shaperone-wc-material/renderer/tabs')

          strategy.group = TabsGroupRenderer
          strategy.focusNode = TabsFocusNodeRenderer
        }

        // todo: expose as a configuration module
        sharedStore.dispatch.renderer.setStrategy(strategy)
        sharedStore.dispatch.renderer.loadDependencies()

        dispatch.rendererSettings.checkLayoutOption({ text })
      },
    }
  },
})
