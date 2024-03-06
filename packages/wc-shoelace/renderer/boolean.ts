import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js'
import { html, SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import { SlCheckbox } from '@shoelace-style/shoelace'

export const render: SingleEditorComponent['render'] = ({ env: { constant: { TRUE, FALSE } }, value, property }, { update }) => {
  function onChecked(e: Event) {
    const target = e.target as SlCheckbox
    update(target.checked ? TRUE : FALSE)
  }

  return html`
      <sl-checkbox .indeterminate="${!value.object}"
                   .checked="${value.object?.term.equals(TRUE) || false}"
                   @sl-change="${onChecked}"
                   .disabled="${property.shape.readOnly || false}"></sl-checkbox>`
}
