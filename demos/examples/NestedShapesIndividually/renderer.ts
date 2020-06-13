import { FormRenderStrategy, defaultFormRenderer } from '@hydrofoil/shaperone-wc/renderer'
import { html } from '@hydrofoil/shaperone-wc'

export const topmostFocusNodeFormRenderer: FormRenderStrategy = (formState, actions, renderFocusNode) => {
  const { focusStack } = formState

  let backButton = html``
  if (focusStack.length > 1) {
    backButton = html`<a href="javascript:void(0)" @click="${actions.popFocusNode}">back</a>`
  }

  return html`${backButton}${defaultFormRenderer(formState, actions, renderFocusNode)}`
}
