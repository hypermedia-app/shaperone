import { html, Render } from '@hydrofoil/shaperone-wc'
import { spread } from '@hydrofoil/shaperone-wc/lib/spread.js'
import { namedNode } from '@rdf-esm/data-model'
import '@vaadin/vaadin-text-field/vaadin-text-field'
import { validity } from './validation'

export const urlEditor: Render = function ({ value }, { update }) {
  const props = {
    '.value': value.object?.value || '',
    required: true,
    '?auto-validate': true,
    ...validity(value),
  }

  return html`<vaadin-text-field ${spread(props)}>
                <input type="url" slot="input" @blur="${(e: any) => update(namedNode(e.target.value))}">
              </vaadin-text-field>`
}
