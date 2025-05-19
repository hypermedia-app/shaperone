import { state } from 'lit/decorators.js'
import { isResource } from 'is-graph-pointer'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { html } from 'lit'
import DetailsBase from '@hydrofoil/shaperone-wc/elements/Details.js'
import { dash } from '@tpluscode/rdf-ns-builders'
import { ShoelaceLoader } from './ShoelaceLoader.js'

export default class extends ShoelaceLoader(DetailsBase) {
  static editor = dash.DetailsEditor

  @state()
  private _open: boolean = false

  renderWhenReady() {
    let innerFocusNode = this.renderSkeleton()

    if (this.objectNode) {
      innerFocusNode = html` <sh1-focus-node .focusNode="${this.objectNode}"></sh1-focus-node>`
    }

    const { object: focusNode } = this.value

    if (isResource(focusNode)) {
      return html`
      <sl-details .open="${this._open}"
                  .summary="${localizedLabel(this.value.object, { fallback: localizedLabel(this.nodeShape?.pointer) }) as any}"
                  @sl-show="${this.open}"
                  @sl-hide="${this.close}"
      >
       ${innerFocusNode}
      </sl-details>`
    }

    return html`<div>not a resource node</div>`
  }

  get dependencies() {
    return {
      'sl-details': import('@shoelace-style/shoelace/dist/components/details/details.component.js'),
    }
  }

  private open() {
    this._open = true
  }

  private close() {
    this._open = false
  }
}
