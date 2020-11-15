import { RenderSingleEditor } from '@hydrofoil/shaperone-wc'
import { html } from 'lit-html'
import { spread } from '@open-wc/lit-helpers'
import { namedNode } from '@rdf-esm/data-model'
import '@vaadin/vaadin-text-field/vaadin-text-field'

export const urlEditor: RenderSingleEditor = function ({ value }, { update }) {
  const props = {
    '.value': value.object?.value || '',
    required: true,
    '?auto-validate': true,
  }

  return html`<vaadin-text-field ...="${spread(props)}">
                <input type="url" slot="input" @blur="${(e: any) => update(namedNode(e.target.value))}">
              </vaadin-text-field>`
}
