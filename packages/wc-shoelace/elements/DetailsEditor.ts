import { SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import type { DetailsEditor } from '@hydrofoil/shaperone-core/components.js'
import { dash } from '@tpluscode/rdf-ns-builders'
import { property, state } from 'lit/decorators.js'
import { isResource } from 'is-graph-pointer'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { html } from 'lit'
import type { NodeShape } from '@rdfine/shacl'
import { ShoelaceLoader } from './ShoelaceLoader.js'

export default class extends ShoelaceLoader(SingleEditorComponent) implements DetailsEditor {
  static editor = dash.DetailsEditor

  @property({ type: Object })
  public nodeShape!: NodeShape

  @state()
  private _open: boolean = false

  renderWhenReady() {
    const { object: focusNode } = this.value

    if (isResource(focusNode)) {
      return html`
      <sl-details .open="${this._open}"
                  .summary="${localizedLabel(this.value.object, { fallback: localizedLabel(this.nodeShape?.pointer) }) as any}"
                  @sl-show="${this.open}"
                  @sl-hide="${this.close}"
      >
        <slot></slot>
      </sl-details>`
    }

    return html`<div>not a resource node</div>`
  }

  * dependencies() {
    yield import('@shoelace-style/shoelace/dist/components/details/details.js')
  }

  private open() {
    this._open = true
  }

  private close() {
    this._open = false
  }
}
