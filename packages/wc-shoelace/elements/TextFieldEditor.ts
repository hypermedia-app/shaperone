import { SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import type { TextFieldEditor } from '@hydrofoil/shaperone-core/components.js'
import { dash } from '@tpluscode/rdf-ns-builders'
import { html } from 'lit'
import type SlInput from '@shoelace-style/shoelace/dist/components/input/input.component.js'
import type { NamedNode } from '@rdfjs/types'
import { ShoelaceLoader } from './ShoelaceLoader.js'

export default class extends ShoelaceLoader(SingleEditorComponent) implements TextFieldEditor {
  static editor: NamedNode = dash.TextFieldEditor

  get type(): SlInput['type'] {
    return 'text'
  }

  * dependencies() {
    yield import('@shoelace-style/shoelace/dist/components/input/input.js')
  }

  renderWhenReady() {
    return html`
      <sl-input .value="${this.value?.object?.value || ''}"
                type="${this.type}"
                .readonly="${this.property.shape.readOnly || false}"
                @sl-change="${(e: any) => this.setValue(e.target.value)}"></sl-input>`
  }
}
