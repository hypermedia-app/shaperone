import { SingleEditorActions } from '@hydrofoil/shaperone-core/models/components'
import { html } from 'lit'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import type { GraphPointer } from 'clownface'
import { repeat } from 'lit/directives/repeat.js'
import { PropertyObjectState } from '@hydrofoil/shaperone-core/models/forms'
import { SlSelect } from '@shoelace-style/shoelace'
import { renderItem } from '../lib/components.js'
import { stop } from '../lib/handlers.js'
import { settings } from '../settings.js'

export function select(value: PropertyObjectState, pointers: GraphPointer[], update: SingleEditorActions['update']) {
  function onChange(e: Event) {
    const target = e.target as SlSelect
    const selected = pointers.find(({ value }) => value === target.value)

    if (selected) { update(selected.term) }
  }

  return html`<sl-select ?hoist="${settings.hoist}" .value=${value.object?.value || ''} @sl-change=${onChange} @sl-hide=${stop}>
    ${repeat(pointers || [], renderItem)}
  </sl-select>`
}
