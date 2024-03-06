import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { html } from 'lit'
import type { GraphPointer } from 'clownface'
import type { NamedNode } from '@rdfjs/types'

export function renderItem(property: NamedNode | NamedNode[]) {
  return (item: GraphPointer) => html`
      <sl-menu-item .value=${item.value}>${localizedLabel(item, {
  property,
  fallback: item.value,
})}</sl-menu-item>`
}
