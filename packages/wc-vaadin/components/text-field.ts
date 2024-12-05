import type { Render, SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import { html } from '@hydrofoil/shaperone-wc'
import { spread } from '@open-wc/lit-helpers'
import { numericDatatypeKind } from '@hydrofoil/shaperone-core/lib/datatypes.js'
import '@vaadin/vaadin-text-field/vaadin-text-field'
import '@vaadin/vaadin-text-field/vaadin-number-field'
import '@vaadin/vaadin-text-field/vaadin-integer-field'
import { validity } from './validation.js'

export const textField: Render<SingleEditorComponent> = function ({ env, value, property }, { update }) {
  const props = {
    '.value': value.object?.value || '',
    required: true,
    '?auto-validate': true,
    '@blur': (e: any) => update(e.target.value),
    ...validity(value),
    '.readonly': !!property.shape.readOnly,
  }

  const datatype = numericDatatypeKind(property.datatype)
  if (datatype === 'decimal') {
    return html`<vaadin-number-field ${spread(props)} has-controls></vaadin-number-field>`
  }

  if (datatype) {
    return html`<vaadin-integer-field ${spread(props)} has-controls></vaadin-integer-field>`
  }

  return html`<vaadin-text-field ...="${spread(props)}"></vaadin-text-field>`
}
