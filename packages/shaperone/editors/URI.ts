import { html } from 'lit'
import { dash } from '@tpluscode/rdf-ns-builders'
import type { URIEditor } from '@shaperone/core/components.js'
import env from '@shaperone/core/env.js'
import { SingleEditorBase } from './SingleEditorBase.js'
import { validity } from './lib/validity.js'

export default class extends SingleEditorBase implements URIEditor {
  static readonly editor = dash.URIEditor

  render() {
    return html`<input .value="${this.value.object?.value || ''}"
                       type="url"
                       ${validity(this.value)}
                       ?disabled="${this.readonly}"
                       @blur="${(e: any) => this.setValue(env().namedNode(e.target.value))}">`
  }
}
