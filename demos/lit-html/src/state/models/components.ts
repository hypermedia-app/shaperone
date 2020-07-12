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
  Material: { ...nativeComponents, ...mwcComponents },
  Vaadin: { ...nativeComponents, ...vaadinComponents, languages: component },
}

editors.addMetadata($rdf.dataset([...metadata()]))
editors.addMatchers({ matcher })

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

      components.pushComponents(componentModules[text])

      return {
        ...state,
        children,
      }
    },
  },
})
