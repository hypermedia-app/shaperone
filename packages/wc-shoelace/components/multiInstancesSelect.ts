import type { GraphPointer } from 'clownface'
import { SlSelect } from '@shoelace-style/shoelace'
import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import type { MultiEditorComponent } from '@hydrofoil/shaperone-wc'
import { difference } from '../lib/difference'
import { settings } from '../settings'
import { stop } from '../lib/handlers'
import { renderItem } from '../lib/components'

import '@shoelace-style/shoelace/dist/components/menu/menu.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'

export const render: MultiEditorComponent['render'] = ({ property, componentState }, { update }) => {
  const values = property.objects.map(o => o.object?.value).filter(isDef)
  const pointers: GraphPointer[] = componentState.instances || []

  function onChange(e: CustomEvent) {
    const target = e.target as SlSelect

    if (Array.isArray(target.value) && difference(target.value, values).length !== 0) {
      const selected = pointers
        .filter(({ value }) => target.value.includes(value))
        .map(({ term }) => term)

      update(selected)
    }
  }

  function selectAll() {
    const all = pointers.map(({ term }) => term)
    update(all)
  }

  return html`
        <sl-select ?hoist="${settings.hoist}"
                   multiple clearable
                   .value=${values}
                   @sl-clear="${() => update([])}"
                   @sl-hide=${stop}
                   @sl-change=${onChange}>
          ${repeat(pointers || [], renderItem)}
        </sl-select>
        <sl-button @click=${selectAll}>
          Select all
        </sl-button>`
}

function isDef<T>(x: T | undefined): x is T {
  return !!x
}
