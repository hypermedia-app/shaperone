import { html } from 'lit-html'
import type { GraphPointer, MultiPointer } from 'clownface'
import '@hydrofoil/shaperone-wc/shaperone-form'

export interface ShaperoneFormKnobs {
  shapes: MultiPointer
  resource: GraphPointer
}

export function ShaperoneForm({ shapes, resource }: ShaperoneFormKnobs) {
  return html`<shaperone-form
    .shapes="${shapes}"
    .resource="${resource}"></shaperone-form>`
}
