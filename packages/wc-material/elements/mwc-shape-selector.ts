import { customElement, html, LitElement, property } from 'lit-element'
import { repeat } from 'lit-html/directives/repeat'
import type { NodeShape } from '@rdfine/shacl'

import './wc-menu'
import '@material/mwc-list/mwc-list-item'

@customElement('mwc-shape-selector')
export class MwcShapeSelector extends LitElement {
  @property({ type: Array })
  shapes?: NodeShape[]

  render() {
    return html`<wc-menu>${repeat(this.shapes || [], this.__renderShapeMenuItem.bind(this))}</wc-menu>`
  }

  private __renderShapeMenuItem(shape: NodeShape) {
    return html`<mwc-list-item @click="${this.__dispatchShapeSelected(shape)}">${shape.label}</mwc-list-item>`
  }

  private __dispatchShapeSelected(shape: NodeShape) {
    return () => {
      this.dispatchEvent(new CustomEvent('shape-selected', {
        detail: {
          value: shape,
        },
      }))
    }
  }
}
