import { html, Render, SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import { spread } from '@hydrofoil/shaperone-wc/lib/spread'
import { xsd } from '@tpluscode/rdf-ns-builders'
import { numericDatatype } from '@hydrofoil/shaperone-core/lib/datatypes'
import '@vaadin/text-field/vaadin-text-field'
import '@vaadin/number-field/vaadin-number-field'
import '@vaadin/integer-field/vaadin-integer-field'
import { validity } from './validation'

export const textField: Render<SingleEditorComponent> = function ({ value, property }, { update }) {
  const props = {
    '.value': value.object?.value || '',
    required: true,
    '?auto-validate': true,
    '@blur': (e: any) => update(e.target.value),
    ...validity(value),
    '.readonly': !!property.shape.readOnly,
  }

  const datatype = numericDatatype(property.datatype)
  if (xsd.decimal.equals(datatype) || xsd.float.equals(datatype) || xsd.double.equals(datatype)) {
    return html`<vaadin-number-field ${spread(props)} has-controls></vaadin-number-field>`
  }

  if (datatype) {
    return html`<vaadin-integer-field ${spread(props)} has-controls></vaadin-integer-field>`
  }

  return html`<vaadin-text-field ...="${spread(props)}"></vaadin-text-field>`
}
