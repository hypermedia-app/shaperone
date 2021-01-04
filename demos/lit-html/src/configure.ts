import type { Component } from '@hydrofoil/shaperone-core'
import * as nativeComponents from '@hydrofoil/shaperone-wc/NativeComponents'
import * as mwcComponents from '@hydrofoil/shaperone-wc-material/components'
import * as LanguageSelect from '@hydrofoil/shaperone-playground-examples/LanguageMultiSelect'
import * as StarRating from '@hydrofoil/shaperone-playground-examples/StarRating'
import { component as starRating } from '@hydrofoil/shaperone-playground-examples/StarRating'
import { DescriptionTooltip } from '@hydrofoil/shaperone-playground-examples/DescriptionTooltip'
import * as vaadinComponents from '@hydrofoil/shaperone-wc-vaadin/components'
import { components, editors, renderer } from '@hydrofoil/shaperone-wc/configure'
import $rdf from 'rdf-ext'
import { dash } from '@tpluscode/rdf-ns-builders'
import { DefaultStrategy } from '@hydrofoil/shaperone-wc/renderer/DefaultStrategy'
import * as MaterialRenderStrategy from '@hydrofoil/shaperone-wc-material/renderer'
import { instancesSelector } from '@hydrofoil/shaperone-hydra/components'
import { ComponentsState } from './state/models/components'
import { RendererState } from './state/models/renderer'

export const componentSets: Record<ComponentsState['components'], Record<string, Component>> = {
  native: { ...nativeComponents, starRating },
  material: { ...nativeComponents, ...mwcComponents, languages: LanguageSelect.component('material'), starRating },
  vaadin: { ...nativeComponents, ...vaadinComponents, languages: LanguageSelect.component('lumo'), starRating },
}

editors.addMetadata($rdf.dataset([...LanguageSelect.metadata(), ...StarRating.metadata()]))
editors.addMatchers({
  languages: LanguageSelect.matcher,
  starRating: StarRating.matcher,
})
editors.decorate(instancesSelector.matcher)
components.decorate(instancesSelector.decorator())
components.decorate(DescriptionTooltip)

export const selectComponents = (() => {
  let currentComponents = componentSets.native
  let previousComponents: ComponentsState['components'] | undefined

  return (name: ComponentsState['components']) => {
    if (previousComponents === name) return
    previousComponents = name

    const modules = componentSets[name]
    components.removeComponents(Object.values(currentComponents).map(m => m.editor))
    components.pushComponents(modules)
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
