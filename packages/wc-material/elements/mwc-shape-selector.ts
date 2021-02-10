import { customElement, html, LitElement, property } from 'lit-element'
import { repeat } from 'lit-html/directives/repeat'
import type { NodeShape } from '@rdfine/shacl'
import { SelectableMenuMixin } from './SelectableMenuMixin'

import './wc-menu'
import '@material/mwc-list/mwc-list-item'

@customElement('mwc-shape-selector')
export class MwcShapeSelector extends SelectableMenuMixin(LitElement) {
  @property({ type: Array })
  shapes?: [NodeShape, string][]

  @property({ type: Object })
  selected?: NodeShape

  render() {
    return html`<wc-menu>${repeat(this.shapes || [], this.__renderShapeMenuItem.bind(this))}</wc-menu>`
  }

  private __renderShapeMenuItem([shape, text]: [NodeShape, string]) {
    return this.createItem({
      text,
      selected: shape.equals(this.selected),
      '@click': this.__dispatchShapeSelected(shape),
    })
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
