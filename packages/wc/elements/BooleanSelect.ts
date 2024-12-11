import { html } from 'lit'
import { dash, xsd } from '@tpluscode/rdf-ns-builders'
import { validity } from '../components/validity.js'
import { readOnly } from '../components/readonly.js'
import { SingleEditorBase } from './SingleEditorBase.js'

export default class extends SingleEditorBase {
  static readonly editor = dash.BooleanSelectEditor

  protected render() {
    return html`<select ${readOnly(this.property)} @change="${this.changed}" ${validity(this.value)}>
      <option></option>
      <option value="true" ?selected="${this.value.object?.value === 'true'}">true</option>
      <option value="false" ?selected="${this.value.object?.value === 'false'}">false</option>
    </select>`
  }

  private changed(e: any) {
    if (e.target.value) {
      this.setValue(this.env.literal(e.target.value, xsd.boolean))
    } else {
      this.clear()
    }
  }
}
