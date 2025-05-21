import { SingleEditorComponent } from 'shaperone'
import type { TextFieldEditor } from '@shaperone/core/components.js'
import { dash } from '@tpluscode/rdf-ns-builders'
import type { NamedNode } from '@rdfjs/types'
import { html } from 'lit'
import { ShoelaceLoader } from './ShoelaceLoader.js'

export default class extends ShoelaceLoader(SingleEditorComponent) implements TextFieldEditor {
  static editor: NamedNode = dash.TextAreaEditor

  renderWhenReady() {
    return html`
      <sl-textarea .value="${this.value?.object?.value || ''}"
                .readonly="${this.readonly}"
                @sl-change="${(e: any) => this.setValue(e.target.value)}"></sl-textarea>`
  }

  get dependencies() {
    return {
      'sl-textarea': import('@shoelace-style/shoelace/dist/components/textarea/textarea.component.js'),
    }
  }
}
