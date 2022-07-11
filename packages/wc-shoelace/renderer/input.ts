import type { SlInput } from '@shoelace-style/shoelace'
import { html, SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import '@shoelace-style/shoelace/dist/components/input/input.js'

interface InputRenderer {
  type?: SlInput['type']
  onChange?(value: string): void
}

export function inputRenderer(arg: InputRenderer = {}): SingleEditorComponent['render'] {
  return ({ value }, { update }) => {
    const onChange = arg.onChange || update

    return html`<sl-input .value="${value.object?.value || ''}"
                          .type="${arg.type || 'text'}"
                          @sl-change="${(e: any) => onChange(e.target.value)}"></sl-input>`
  }
}
