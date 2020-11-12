import type { SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import { html } from 'lit-html'
import { literal } from '@rdf-esm/data-model'
import { dash } from '@tpluscode/rdf-ns-builders'

export const textArea: SingleEditorComponent = {
  editor: dash.TextAreaEditor,

  render({ value }, { update }) {
    return html`
      <vaadin-text-area
        .value="${value.object?.value || ''}"
        required
        auto-validate
        @blur="${(e: any) => update(literal(e.target.value))}"
      ></vaadin-text-area>
    `
  },

  loadDependencies() {
    return [import('@vaadin/vaadin-text-field/vaadin-text-area')]
  },
}
