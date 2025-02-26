import type { Component } from '@hydrofoil/shaperone-core'
import * as nativeComponents from '@hydrofoil/shaperone-wc/NativeComponents.js'
import * as mwcComponents from '@hydrofoil/shaperone-wc-material/components.js'
import * as LanguageSelect from '@hydrofoil/shaperone-playground-examples/LanguageMultiSelect/index.js'
import * as StarRating from '@hydrofoil/shaperone-playground-examples/StarRating/index.js'
import { component as starRating } from '@hydrofoil/shaperone-playground-examples/StarRating/index.js'
import { DescriptionTooltip } from '@hydrofoil/shaperone-playground-examples/DescriptionTooltip.js'
import * as vaadinComponents from '@hydrofoil/shaperone-wc-vaadin/components.js'
import * as shoelaceComponents from '@hydrofoil/shaperone-wc-shoelace/components.js'
import { settings as shoelaceSettings } from '@hydrofoil/shaperone-wc-shoelace/settings.js'
import type { ConfigCallback } from '@hydrofoil/shaperone-wc/configure.js'
import { configure } from '@hydrofoil/shaperone-wc/configure.js'
import { dash } from '@tpluscode/rdf-ns-builders'
import type { Decorate, RenderTemplate } from '@hydrofoil/shaperone-wc/templates.js'
import { templates } from '@hydrofoil/shaperone-wc/templates.js'
import * as MaterialRenderStrategy from '@hydrofoil/shaperone-wc-material/renderer/index.js'
import shaperoneHydra from '@hydrofoil/shaperone-hydra'
import { validate } from '@hydrofoil/shaperone-rdf-validate-shacl'
import * as xone from '@hydrofoil/shaperone-playground-examples/XoneRenderer/index.js'
import { errorSummary } from '@hydrofoil/shaperone-playground-examples/ErrorSummary/index.js'
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js'
import $rdf from './env.js'
import type { ComponentsState } from './state/models/components.js'
import type { RendererState } from './state/models/renderer.js'

setBasePath('https://unpkg.com/@shoelace-style/shoelace/dist')
shoelaceSettings.hoist = false

export const componentSets: Record<ComponentsState['components'], Record<string, Component>> = {
  native: { ...nativeComponents, starRating },
  material: { ...nativeComponents, ...mwcComponents, languages: LanguageSelect.component('material'), starRating },
  vaadin: { ...nativeComponents, ...vaadinComponents, languages: LanguageSelect.component('lumo'), starRating },
  shoelace: { ...nativeComponents, ...shoelaceComponents, starRating },
}

function * focusNodeDecorators(labs: RendererState['labs']) {
  if (labs?.xone) {
    yield xone.focusNode
  }
  if (labs?.errorSummary) {
    yield errorSummary
  }
  yield MaterialRenderStrategy.focusNode
}

let focusNodeTemplate = templates.focusNode

const initialRenderStrategy = {
  ...templates,
  ...MaterialRenderStrategy,
  focusNode: [...focusNodeDecorators({})].reduce(combineDecorators, focusNodeTemplate),
}

configure($rdf, ({ editors, components, validation, renderer }) => {
  editors.addMetadata(env => [...LanguageSelect.metadata(env), ...StarRating.metadata(env)])
  editors.addMatchers({
    languages: LanguageSelect.matcher,
    starRating: StarRating.matcher,
  })
  shaperoneHydra({
    editors,
    components,
  })
  components.decorate(DescriptionTooltip)

  validation.setValidator(validate)

  renderer.setTemplates(initialRenderStrategy)
})

export const selectComponents = (() => {
  let currentComponents = componentSets.native
  let previousComponents: ComponentsState['components'] | undefined

  return (name: ComponentsState['components']): ConfigCallback => ({ components }) => {
    if (previousComponents === name) return
    previousComponents = name

    const modules = componentSets[name]
    components.removeComponents(Object.values(currentComponents).map(m => m.editor))
    components.pushComponents(modules)
    currentComponents = modules
  }
})()

function combineDecorators<Template extends RenderTemplate>(combined: Template, next: Decorate<Template>) {
  return next(combined)
}

export const configureRenderer = (() => {
  let previousNesting: RendererState['nesting']
  let previousGrouping: RendererState['grouping']
  let previousLabs: RendererState['labs']

  return {
    switchNesting({ nesting }: RendererState): ConfigCallback {
      return async ({ renderer, components }) => {
        if (previousNesting === nesting) return
        previousNesting = nesting

        if (nesting === 'always one') {
          const { topmostFocusNodeFormRenderer } = await import('@hydrofoil/shaperone-playground-examples/NestedShapesIndividually/renderer.js')
          const nestingComponents = await import('@hydrofoil/shaperone-playground-examples/NestedShapesIndividually/components.js')

          renderer.setTemplates({
            form: topmostFocusNodeFormRenderer(initialRenderStrategy.form),
          })
          components.pushComponents(nestingComponents)
        } else if (nesting === 'inline') {
          const nestingComponents = await import('@hydrofoil/shaperone-playground-examples/InlineNestedShapes')
          components.pushComponents(nestingComponents)
        } else {
          renderer.setTemplates({ form: initialRenderStrategy.form })
          components.removeComponents([dash.DetailsEditor])
        }
      }
    },

    switchLayout({ grouping, labs }: RendererState): ConfigCallback {
      return async ({ renderer }) => {
        if (previousGrouping === grouping) return
        previousGrouping = grouping

        const strategy = {
          focusNode: initialRenderStrategy.focusNode,
          group: initialRenderStrategy.group,
        }

        if (grouping === 'vaadin accordion') {
          const {
            AccordionGroupingRenderer,
            AccordionFocusNodeRenderer,
          } = await import('@hydrofoil/shaperone-wc-vaadin/renderer/accordion.js')

          strategy.group = AccordionGroupingRenderer
          focusNodeTemplate = AccordionFocusNodeRenderer
        } else if (grouping === 'material tabs') {
          const {
            TabsGroupRenderer,
            TabsFocusNodeRenderer,
          } = await import('@hydrofoil/shaperone-wc-material/renderer/tabs.js')

          strategy.group = TabsGroupRenderer
          focusNodeTemplate = TabsFocusNodeRenderer
        }

        strategy.focusNode = [...focusNodeDecorators(labs)].reduce(combineDecorators, focusNodeTemplate)
        renderer.setTemplates(strategy)
      }
    },

    setLabs({ labs }: RendererState): ConfigCallback {
      return ({ renderer }) => {
        if (JSON.stringify(previousLabs) === JSON.stringify(labs)) return

        previousLabs = labs

        renderer.setTemplates({
          focusNode: [...focusNodeDecorators(labs)].reduce(combineDecorators, focusNodeTemplate),
        })
      }
    },
  }
})()
