import { html } from 'lit'
import { dash } from '@tpluscode/rdf-ns-builders'
import { SingleEditorBase } from './SingleEditorBase.js'
import { readOnly } from '../components/readonly.js'
import { validity } from '../components/validity.js'

export default class extends SingleEditorBase {
  static readonly editor = dash.TextAreaEditor

  render() {
    return html`<textarea ${readOnly(this.property)}
                          @blur="${(e: any) => this.setValue(e.target.value)}"
                          ${validity(this.value)}>${this.value.object?.value}</textarea>`
  }
}
