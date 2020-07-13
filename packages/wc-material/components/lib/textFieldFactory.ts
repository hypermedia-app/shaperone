import type { SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import { html } from 'lit-element'

export interface TextFieldOptions {
  type(args: Parameters<SingleEditorComponent['render']>[0]): string
}

const defaultTextField: TextFieldOptions = {
  type(): string {
    return 'text'
  },
}

export const createTextField = (editor: SingleEditorComponent['editor'], options: TextFieldOptions = defaultTextField): SingleEditorComponent & TextFieldOptions => ({
  ...options,
  editor,
  render({ value, property }, { update }) {
    return html`<mwc-textfield
        .value="${value.object.value}"
        type="${this.type({ value, property })}"
        required
        @blur="${(e: any) => update(e.target.value)}"></mwc-textfield>`
  },
  loadDependencies: () => [
    import('@material/mwc-textfield/mwc-textfield'),
  ],
})
