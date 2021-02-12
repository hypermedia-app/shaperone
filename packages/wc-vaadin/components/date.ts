import type { Render } from '@hydrofoil/shaperone-wc'
import { html } from 'lit-html'
import '@vaadin/vaadin-date-picker/vaadin-date-picker'
import '@vaadin/vaadin-date-time-picker/vaadin-date-time-picker'

export const datePicker: Render = function ({ value, actions: { update } }) {
  return html`<vaadin-date-picker
                .value="${value.object?.value || ''}"
                @value-changed="${(e: CustomEvent) => update(e.detail.value)}"></vaadin-date-picker>`
}

export const dateTimePicker: Render = function ({ value, actions: { update } }) {
  return html`<vaadin-date-time-picker
                .value="${value.object?.value || ''}"
                @value-changed="${(e: CustomEvent) => update(e.detail.value)}"></vaadin-date-time-picker>`
}
