import type { Render } from '@hydrofoil/shaperone-wc'
import { html } from '@hydrofoil/shaperone-wc'
import { spread } from '@open-wc/lit-helpers'
import '@vaadin/vaadin-text-field/vaadin-text-field'
import { validity } from './validation.js'

export const urlEditor: Render = function ({ env, value, property }, { update }) {
  const props = {
    '.value': value.object?.value || '',
    required: true,
    '?auto-validate': true,
    ...validity(value),
    '.readonly': !!property.shape.readOnly,
  }

  return html`<vaadin-text-field ${spread(props)}>
                <input type="url" slot="input" @blur="${(e: any) => update(env.namedNode(e.target.value))}">
              </vaadin-text-field>`
}
