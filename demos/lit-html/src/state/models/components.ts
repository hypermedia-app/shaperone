import { createModel } from '@captaincodeman/rdx'
import * as vaadinComponents from '@hydrofoil/shaperone-wc-vaadin/components'
import * as nativeComponents from '@hydrofoil/shaperone-wc/components'
import * as mwcComponents from '@hydrofoil/shaperone-wc-material/components'
import { EditorFactory } from '@hydrofoil/shaperone-wc/components'
import { Menu } from '../../menu'

const componentModules: Record<string, Record<string, EditorFactory>> = {
  Native: nativeComponents,
  Material: { ...nativeComponents, ...mwcComponents },
  Vaadin: { ...nativeComponents, ...vaadinComponents },
}
export const components = createModel({
  state: {
    text: 'Components',
    selected: componentModules.Native,
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

      return {
        ...state,
        selected: componentModules[text],
        children,
      }
    },
  },
})
