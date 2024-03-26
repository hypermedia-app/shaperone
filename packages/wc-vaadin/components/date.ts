import { html, Render } from '@hydrofoil/shaperone-wc'
import '@vaadin/vaadin-date-picker/vaadin-date-picker'
import '@vaadin/vaadin-date-time-picker/vaadin-date-time-picker'
import { spread } from '@hydrofoil/shaperone-wc/lib/spread.js'
import { validity } from './validation.js'

export const datePicker: Render = function ({ value, property }, { update }) {
  return html`<vaadin-date-picker ${spread(validity(value))}
                .value="${value.object?.value || ''}" .readonly="${!!property.shape.readOnly}"
                @value-changed="${(e: CustomEvent) => update(e.detail.value)}"></vaadin-date-picker>`
}

export const dateTimePicker: Render = function ({ value, property }, { update }) {
  return html`<vaadin-date-time-picker ${spread(validity(value))}
                .value="${value.object?.value || ''}" .readonly="${!!property.shape.readOnly}"
                @value-changed="${(e: CustomEvent) => update(e.detail.value)}"></vaadin-date-time-picker>`
}
