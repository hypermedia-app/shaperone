import { dash } from '@tpluscode/rdf-ns-builders'
import type { DatePickerEditor } from '@hydrofoil/shaperone-core/components.js'
import { html } from 'lit'
import { SingleEditorBase } from './SingleEditorBase.js'
import { validity } from './lib/validity.js'
import { readOnly } from './lib/readonly.js'

export default class extends SingleEditorBase implements DatePickerEditor {
  static readonly editor = dash.DatePickerEditor

  render() {
    return html`<input .value="${this.value.object?.value || ''}"
                     type="date"
                     ${validity(this.value)}
                     ${readOnly(this.property)}
                     @blur="${(e: any) => this.setValue(e.target.value)}">`
  }
}
