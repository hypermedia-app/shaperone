import { SingleEditorActions } from '@hydrofoil/shaperone-core/models/components'
import { html } from 'lit'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import type { GraphPointer } from 'clownface'
import { repeat } from 'lit/directives/repeat.js'
import { PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import { SlSelect } from '@shoelace-style/shoelace'
import { renderItem } from '../lib/components.js'
import { stop } from '../lib/handlers.js'
import { settings } from '../settings.js'

interface Parameters {
  value: PropertyObjectState
  pointers: GraphPointer[]
  update: SingleEditorActions['update']
  property: PropertyState
}

export function select({ update, value, pointers, property }: Parameters) {
  function onChange(e: Event) {
    const target = e.target as SlSelect
    const selected = pointers.find(({ value }) => value === target.value)

    if (selected) { update(selected.term) }
  }

  return html`<sl-select .disabled="${property.shape.readOnly || false}" ?hoist="${settings.hoist}" .value=${value.object?.value || ''} @sl-change=${onChange} @sl-hide=${stop}>
    ${repeat(pointers || [], renderItem)}
  </sl-select>`
}
