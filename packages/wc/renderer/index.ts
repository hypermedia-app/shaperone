/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-wc/renderer
 */

import { html, TemplateResult } from 'lit-element'
import { FocusNode } from '@hydrofoil/shaperone-core'
import { FormRenderer, Renderer } from '@hydrofoil/shaperone-core/renderer'
import { RenderTemplates } from '../templates'
import { renderFocusNode } from './focusNode'

declare module '@hydrofoil/shaperone-core/renderer' {
  interface RenderContext {
    /**
     * `@hydrofoil/shaperone-wc` extension which simplifies implementation of partial templates
     * for the base form elements as well any additional UI elements
     *
     * @category wc
     */
    templates: RenderTemplates
  }
}

export default <Renderer<TemplateResult>>{
  render(context): TemplateResult {
    const { form, editors, state, components, templates, dispatch } = context

    if (!form || !editors || !state || !components) {
      return html``
    }

    const actions = {
      truncateFocusNodes: (focusNode: FocusNode) => dispatch.forms.truncateFocusNodes({ form, focusNode }),
      popFocusNode: () => dispatch.forms.popFocusNode({ form }),
    }

    const renderer: FormRenderer = {
      context,
      actions,
      renderFocusNode,
    }

    return templates.form(renderer)
  },
}
