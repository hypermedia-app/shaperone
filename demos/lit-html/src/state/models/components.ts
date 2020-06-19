import { createModel } from '@captaincodeman/rdx'
import { Component } from '@hydrofoil/shaperone-wc'
import * as vaadinComponents from '@hydrofoil/shaperone-wc-vaadin/components'
import * as nativeComponents from '@hydrofoil/shaperone-wc/NativeComponents'
import * as mwcComponents from '@hydrofoil/shaperone-wc-material/components'
import { store as sharedStore } from '@hydrofoil/shaperone-wc/store'
import { Menu } from '../../menu'

const componentModules: Record<string, Record<string, Component>> = {
  Native: nativeComponents,
  Material: { ...nativeComponents, ...mwcComponents },
  Vaadin: { ...nativeComponents, ...vaadinComponents },
}

export const componentsSettings = createModel({
  state: {
    text: 'Components',
    children: Object.keys(componentModules).map(name => ({
      text: name,
      checked: name === 'Native',
      type: 'components',
    })),
  },
  reducers: {
    switchComponents(state, { text }: Menu) {
      const children = state.children.map(child => ({
        ...child,
        checked: text === child.text,
      }))

      // todo: expose as a configuration module
      sharedStore.dispatch.components.pushComponents(componentModules[text])

      return {
        ...state,
        children,
      }
    },
  },
})
