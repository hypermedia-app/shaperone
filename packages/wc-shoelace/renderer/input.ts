import type { SlInput } from '@shoelace-style/shoelace'
import type { SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import { html } from '@hydrofoil/shaperone-wc'
import '@shoelace-style/shoelace/dist/components/input/input.js'

interface InputRenderer {
  type?: SlInput['type']
  onChange?(value: string): void
}

export function inputRenderer(arg: InputRenderer = {}): SingleEditorComponent['render'] {
  return ({ value, property }, { update }) => {
    const onChange = arg.onChange || update

    return html`<sl-input .value="${value.object?.value || ''}"
                          .type="${arg.type || 'text'}"
                          .readonly="${property.shape.readOnly || false}"
                          @sl-change="${(e: any) => onChange(e.target.value)}"></sl-input>`
  }
}
