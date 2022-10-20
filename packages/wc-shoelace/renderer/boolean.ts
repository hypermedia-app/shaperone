import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js'
import { html, SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import $rdf from '@rdfjs/data-model'
import { SlCheckbox } from '@shoelace-style/shoelace'
import { xsd } from '@tpluscode/rdf-ns-builders'

const TRUE = $rdf.literal('true', xsd.boolean)
const FALSE = $rdf.literal('false', xsd.boolean)

export const render: SingleEditorComponent['render'] = ({ value, property }, { update }) => {
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
