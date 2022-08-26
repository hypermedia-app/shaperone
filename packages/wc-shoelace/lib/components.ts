import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { html } from 'lit'
import type { GraphPointer } from 'clownface'

export function renderItem(item: GraphPointer) {
  return html`<sl-menu-item .value=${item.value}>${localizedLabel(item, { fallback: item.value })}</sl-menu-item>`
}
