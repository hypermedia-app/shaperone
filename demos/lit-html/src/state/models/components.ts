import { createModel } from '@captaincodeman/rdx'
import $rdf from 'rdf-ext'
import { Component } from '@hydrofoil/shaperone-wc'
import * as vaadinComponents from '@hydrofoil/shaperone-wc-vaadin/components'
import * as nativeComponents from '@hydrofoil/shaperone-wc/NativeComponents'
import * as mwcComponents from '@hydrofoil/shaperone-wc-material/components'
import { components, editors } from '@hydrofoil/shaperone-wc/configure'
import { component, metadata, matcher } from '@hydrofoil/shaperone-playground-examples/LanguageMultiSelect'
import { Menu } from '../../menu'

const componentModules: Record<string, Record<string, Component>> = {
  Native: { ...nativeComponents },
  Material: { ...nativeComponents, ...mwcComponents, languages: component('material') },
  Vaadin: { ...nativeComponents, ...vaadinComponents, languages: component('lumo') },
}

editors.addMetadata($rdf.dataset([...metadata()]))
editors.addMatchers({ matcher })

export interface ComponentsState extends Menu {
  modules: Record<string, Component>
}

export const componentsSettings = createModel({
  state: <ComponentsState>{
    text: 'Components',
    modules: componentModules.Native,
    children: [...Object.keys(componentModules).map(name => ({
      text: name,
      checked: name === 'Native',
      type: 'components',
    })), {
      component: 'hr',
    }, {
      text: 'Disable editor choice',
      checked: false,
      type: 'editorChoice',
    }],
  },
  reducers: {
    switchComponents(state, { text }: Menu) {
      if (!text) {
        return state
      }

      const children = state.children?.map((child) => {
        if (child.type !== 'components') {
          return child
        }

        return ({
          ...child,
          checked: text === child.text,
        })
      })

      const modules = componentModules[text]
      components.removeComponents(Object.values(state.modules).map(m => m.editor))
      components.pushComponents(modules)

      return {
        ...state,
        modules,
        children,
      }
    },
    setEditorChoice(state, { checked }: Menu) {
      const children = state.children?.map((child) => {
        if (child.type === 'editorChoice') {
          return {
            ...child,
            checked: !checked,
          }
        }

        return child
      })
      return {
        ...state,
        children,
      }
    },
  },
})
