import { FormRenderStrategy, defaultFormRenderer } from '@hydrofoil/shaperone-wc/renderer'
import { html, css } from '@hydrofoil/shaperone-wc'

export const topmostFocusNodeFormRenderer: FormRenderStrategy = (formState, actions, renderFocusNode) => {
  const { focusStack } = formState

  let backButton = html``
  if (focusStack.length > 1) {
    backButton = html`<a class="form-back-button" href="javascript:void(0)" @click="${actions.popFocusNode}">back</a>`
  }

  return html`${backButton}${defaultFormRenderer(formState, actions, renderFocusNode)}`
}

topmostFocusNodeFormRenderer.styles = css`.form-back-button {
    display: block;
    width: 115px;
    height: 25px;
    background: #4E9CAF;
    padding: 10px;
    text-align: center;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    line-height: 25px;
}`
