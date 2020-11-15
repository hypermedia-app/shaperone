import type { RenderSingleEditor } from '@hydrofoil/shaperone-wc'
import { html } from 'lit-html'
import { spread } from '@open-wc/lit-helpers'
import { xsd } from '@tpluscode/rdf-ns-builders'
import { numericDatatype } from '@hydrofoil/shaperone-core/lib/datatypes'
import '@vaadin/vaadin-text-field/vaadin-text-field'
import '@vaadin/vaadin-text-field/vaadin-number-field'
import '@vaadin/vaadin-text-field/vaadin-integer-field'

export const textField: RenderSingleEditor = function ({ value, property }, { update }) {
  const props = {
    '.value': value.object?.value || '',
    required: true,
    '?auto-validate': true,
    '@blur': (e: any) => update(e.target.value),
  }

  const datatype = numericDatatype(property.datatype)
  if (xsd.decimal.equals(datatype) || xsd.float.equals(datatype) || xsd.double.equals(datatype)) {
    return html`<vaadin-number-field ...="${spread(props)}" has-controls></vaadin-number-field>`
  }

  if (datatype) {
    return html`<vaadin-integer-field ...="${spread(props)}" has-controls></vaadin-integer-field>`
  }

  return html`<vaadin-text-field ...="${spread(props)}"></vaadin-text-field>`
}
