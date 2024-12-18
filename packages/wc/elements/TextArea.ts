import { html } from 'lit'
import { dash } from '@tpluscode/rdf-ns-builders'
import type { TextAreaEditor } from '@hydrofoil/shaperone-core/components.js'
import { SingleEditorBase } from './SingleEditorBase.js'
import { readOnly } from './lib/readonly.js'
import { validity } from './lib/validity.js'

export default class extends SingleEditorBase implements TextAreaEditor {
  static readonly editor = dash.TextAreaEditor

  render() {
    return html`<textarea ${readOnly(this.property)}
                          @blur="${(e: any) => this.setValue(e.target.value)}"
                          ${validity(this.value)}>${this.value.object?.value}</textarea>`
  }
}
