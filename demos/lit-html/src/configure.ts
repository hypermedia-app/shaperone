import type { Component } from '@hydrofoil/shaperone-core'
import * as nativeComponents from '@hydrofoil/shaperone-wc/NativeComponents'
import * as mwcComponents from '@hydrofoil/shaperone-wc-material/components'
import { component, matcher, metadata } from '@hydrofoil/shaperone-playground-examples/LanguageMultiSelect'
import * as vaadinComponents from '@hydrofoil/shaperone-wc-vaadin/components'
import { components, editors, renderer } from '@hydrofoil/shaperone-wc/configure'
import $rdf from 'rdf-ext'
import { dash } from '@tpluscode/rdf-ns-builders'
import { DefaultStrategy } from '@hydrofoil/shaperone-wc/renderer/DefaultStrategy'
import * as MaterialRenderStrategy from '@hydrofoil/shaperone-wc-material/renderer'
import { instanceSelector } from '@hydrofoil/shaperone-hydra/components'
import { ComponentsState } from './state/models/components'
import { RendererState } from './state/models/renderer'

export const componentSets: Record<ComponentsState['components'], Record<string, Component>> = {
  native: { ...nativeComponents },
  material: { ...nativeComponents, ...mwcComponents, languages: component('material') },
  vaadin: { ...nativeComponents, ...vaadinComponents, languages: component('lumo') },
}

editors.addMetadata($rdf.dataset([...metadata()]))
editors.addMatchers({ matcher })
editors.decorate(instanceSelector.matcher)

export const selectComponents = (() => {
  let currentComponents = componentSets.native
  let previousComponents: ComponentsState['components'] | undefined

  return (name: ComponentsState['components']) => {
    if (previousComponents === name) return
    previousComponents = name

    const modules = componentSets[name]
    components.removeComponents(Object.values(currentComponents).map(m => m.editor))
    components.pushComponents(modules)
    components.decorate(instanceSelector.decorator())
    currentComponents = modules
  }
})()

export const configureRenderer = (() => {
  const initialStrategy = {
    ...DefaultStrategy,
    ...MaterialRenderStrategy,
    focusNode: MaterialRenderStrategy.focusNode(DefaultStrategy.focusNode),
  }

  renderer.setStrategy(initialStrategy)

  let previousNesting: RendererState['nesting']
  let previousGrouping: RendererState['grouping']

  return {
    async switchNesting({ nesting }: RendererState) {
      if (previousNesting === nesting) return
      previousNesting = nesting

      if (nesting === 'always one') {
        const { topmostFocusNodeFormRenderer } = await import('@hydrofoil/shaperone-playground-examples/NestedShapesIndividually/renderer')
        const nestingComponents = await import('@hydrofoil/shaperone-playground-examples/NestedShapesIndividually/components')

        renderer.setStrategy({
          form: topmostFocusNodeFormRenderer,
        })
        components.pushComponents(nestingComponents)
      } else {
        renderer.setStrategy({ form: initialStrategy.form })
        components.removeComponents([dash.DetailsEditor])
      }
    },

    async switchLayout({ grouping }: RendererState) {
      if (previousGrouping === grouping) return
      previousGrouping = grouping

      const strategy = {
        focusNode: initialStrategy.focusNode,
        group: initialStrategy.group,
      }

      if (grouping === 'vaadin accordion') {
        const {
          AccordionGroupingRenderer,
          AccordionFocusNodeRenderer,
        } = await import('@hydrofoil/shaperone-wc-vaadin/renderer/accordion')

        strategy.group = AccordionGroupingRenderer
        strategy.focusNode = MaterialRenderStrategy.focusNode(AccordionFocusNodeRenderer)
      } else if (grouping === 'material tabs') {
        const {
          TabsGroupRenderer,
          TabsFocusNodeRenderer,
        } = await import('@hydrofoil/shaperone-wc-material/renderer/tabs')

        strategy.group = TabsGroupRenderer
        strategy.focusNode = MaterialRenderStrategy.focusNode(TabsFocusNodeRenderer)
      }

      renderer.setStrategy(strategy)
    },
  }
})()
