import { SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import type { TextFieldEditor } from '@hydrofoil/shaperone-core/components.js'
import { dash } from '@tpluscode/rdf-ns-builders'
import { css, html } from 'lit'
import { state } from 'lit/decorators.js'
import type SlInput from '@shoelace-style/shoelace/dist/components/input/input.component.js'

export class TextField extends SingleEditorComponent implements TextFieldEditor {
  static editor = dash.TextFieldEditor

  static get styles() {
    return css`
      sl-skeleton {
        width: 100px;
      }
    `
  }

  @state()
  private ready = false

  get type(): SlInput['type'] {
    return 'text'
  }

  connectedCallback() {
    import('@shoelace-style/shoelace/dist/components/input/input.js').then(() => {
      this.ready = true
    })

    super.connectedCallback()
  }

  protected render(): unknown {
    if (!this.ready) {
      return html`
        <sl-skeleton effect="sheen"></sl-skeleton>`
    }

    return html`
      <sl-input .value="${this.value?.object?.value || ''}"
                type="${this.type}"
                .readonly="${this.property.shape.readOnly || false}"
                @sl-change="${(e: any) => this.setValue(e.target.value)}"></sl-input>`
  }
}
