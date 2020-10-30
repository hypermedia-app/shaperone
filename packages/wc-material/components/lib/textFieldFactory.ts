import type { SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import { html } from 'lit-element'
import { PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import { Term } from 'rdf-js'

interface SingleEditorComponentFactory<TOptions> {
  (editor: SingleEditorComponent['editor'], options?: TOptions): SingleEditorComponent & TOptions
}

export interface TextFieldOptions {
  type(args: { value: PropertyObjectState; property: PropertyState }): string
  createTerm?(value: string): Term
}

const defaultTextField: TextFieldOptions = {
  type(): string {
    return 'text'
  },
}

export const createTextField: SingleEditorComponentFactory<TextFieldOptions> = (editor, options = defaultTextField) => ({
  ...options,
  editor,
  render({ value, property }, { update }) {
    return html`<mwc-textfield
        .value="${value.object.value}"
        type="${this.type({ value, property })}"
        required
        @blur="${(e: any) => update(this.createTerm ? this.createTerm(e.target.value) : e.target.value)}"></mwc-textfield>`
  },
  loadDependencies: () => [
    import('@material/mwc-textfield/mwc-textfield'),
  ],
})
