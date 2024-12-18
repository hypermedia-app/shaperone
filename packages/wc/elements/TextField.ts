import { html } from 'lit'
import { spread } from '@open-wc/lit-helpers'
import { dash } from '@tpluscode/rdf-ns-builders'
import { SingleEditorBase } from './SingleEditorBase.js'
import { readOnly } from './lib/readonly.js'
import { validity } from './lib/validity.js'
import { getType } from './lib/textFieldType.js'

export default class extends SingleEditorBase {
  static readonly editor = dash.TextFieldEditor

  render() {
    return html`<input .value="${this.value?.object?.value || ''}"
                     ${spread(getType(this.property?.datatype))}
                     ${validity(this.value)}
                     ${readOnly(this.property)}
                     @blur="${(e: any) => this.setValue(e.target.value)}">`
  }
}
