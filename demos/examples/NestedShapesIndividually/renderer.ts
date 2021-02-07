import { FormTemplate } from '@hydrofoil/shaperone-wc/templates'
import { html, css } from '@hydrofoil/shaperone-wc'

export const topmostFocusNodeFormRenderer = (form: FormTemplate): FormTemplate => {
  const formTemplate: FormTemplate = function () {
    let backButton = html``
    if (this.context.state.focusStack.length > 1) {
      backButton = html`<a class="form-back-button" href="javascript:void(0)" @click="${this.actions.popFocusNode}">back</a>`
    }

    return html`${backButton}${form.call(this)}`
  }

  formTemplate.styles = css`.form-back-button {
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

  return formTemplate
}
