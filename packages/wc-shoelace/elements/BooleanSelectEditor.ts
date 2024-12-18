import { html } from 'lit'
import { dash } from '@tpluscode/rdf-ns-builders'
import type { BooleanSelectEditor } from '@hydrofoil/shaperone-core/components.js'
import env from '@hydrofoil/shaperone-core/env.js'
import type { SlCheckbox } from '@shoelace-style/shoelace'
import { SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import { ShoelaceLoader } from './ShoelaceLoader.js'

export default class extends ShoelaceLoader(SingleEditorComponent) implements BooleanSelectEditor {
  static editor = dash.BooleanSelectEditor

  renderWhenReady() {
    return html`<sl-checkbox .indeterminate="${!this.value.object}"
                   .checked="${this.value.object?.term.equals(env().constant.TRUE) || false}"
                   @sl-change="${this.onChecked}"
                   .disabled="${this.property.shape.readOnly || false}"></sl-checkbox>`
  }

  * dependencies() {
    yield import('@shoelace-style/shoelace/dist/components/checkbox/checkbox.js')
  }

  onChecked(e: Event) {
    const target = e.target as SlCheckbox
    this.setValue(target.checked ? env().constant.TRUE : env().constant.FALSE)
  }
}
