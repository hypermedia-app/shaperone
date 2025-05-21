import { dash } from '@tpluscode/rdf-ns-builders'
import type { DateTimePickerEditor } from '@hydrofoil/shaperone-core/components.js'
import { html } from 'lit'
import { SingleEditorBase } from './SingleEditorBase.js'
import { validity } from './lib/validity.js'

export default class extends SingleEditorBase implements DateTimePickerEditor {
  static readonly editor = dash.DateTimePickerEditor

  render() {
    return html`<input .value="${this.value.object?.value || ''}"
                     type="datetime-local"
                     ${validity(this.value)}
                     ?disabled="${this.readonly}"
                     @blur="${(e: any) => this.setValue(e.target.value)}">`
  }
}
