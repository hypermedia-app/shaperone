import type { SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import { dash } from '@tpluscode/rdf-ns-builders'
import { html } from 'lit-html'

export const datePicker: SingleEditorComponent = {
  editor: dash.DatePickerEditor,
  render({ property, value }, { update }) {
    return html`<vaadin-date-picker
                  .value="${value.object?.value}"
                  @value-changed="${(e: CustomEvent) => update(e.detail.value)}"></vaadin-date-picker>`
  },
  loadDependencies: () => [
    import('@vaadin/vaadin-date-picker/vaadin-date-picker'),
  ],
}

export const dateTimePicker: SingleEditorComponent = {
  editor: dash.DateTimePickerEditor,
  render({ property, value }, { update }) {
    return html`<vaadin-date-time-picker
                  .value="${value.object?.value}"
                  @value-changed="${(e: CustomEvent) => update(e.detail.value)}"></vaadin-date-time-picker>`
  },
  loadDependencies: () => [
    import('@vaadin/vaadin-date-time-picker/vaadin-date-time-picker'),
  ],
}
