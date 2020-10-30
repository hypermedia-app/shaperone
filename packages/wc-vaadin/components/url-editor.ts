import type { Component } from '@hydrofoil/shaperone-wc'
import { html } from 'lit-html'
import { spread } from '@open-wc/lit-helpers'
import { dash } from '@tpluscode/rdf-ns-builders'
import { namedNode } from '@rdf-esm/data-model'

export const urlEditor: Component = {
  editor: dash.URIEditor,

  render({ value }, { update }) {
    const props = {
      '.value': value.object.value,
      required: true,
      '?auto-validate': true,
    }

    return html`<vaadin-text-field ...="${spread(props)}">
                  <input type="url" slot="input" @blur="${(e: any) => update(namedNode(e.target.value))}">
                </vaadin-text-field>`
  },

  loadDependencies() {
    return [
      import('@vaadin/vaadin-text-field/vaadin-text-field'),
    ]
  },
}
