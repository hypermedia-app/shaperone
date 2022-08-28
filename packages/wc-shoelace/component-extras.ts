import {
  instancesSelect,
} from '@hydrofoil/shaperone-core/components.js'
import * as select from '@hydrofoil/shaperone-core/lib/components/base/instancesSelect.js'
import sh1 from '@hydrofoil/shaperone-core/ns.js'
import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { Lazy, MultiEditorComponent } from '@hydrofoil/shaperone-wc'
import { difference } from '@ngard/tiny-difference'
import { SlSelect } from '@shoelace-style/shoelace'
import type { GraphPointer } from 'clownface'
import { renderItem } from './lib/components.js'
import { stop } from './lib/handlers.js'
import { settings } from './settings.js'

export const instancesMultiSelectEditor: Lazy<MultiEditorComponent> = {
  ...select,
  editor: sh1.InstancesMultiSelectEditor,
  init(...args: [any, any]) {
    return instancesSelect.init?.call(this, ...args) || true
  },
  async lazyRender() {
    return ({ property, componentState }, { update }) => {
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
        <sl-select ?hoist="${settings.hoist}" multiple clearable .value=${values} @sl-hide=${stop} @sl-change=${onChange}>
          ${repeat(pointers || [], renderItem)}
        </sl-select>
        <sl-button @click=${selectAll}>
          Select all
        </sl-button>`
    }
  },
}

function isDef<T>(x: T | undefined): x is T {
  return !!x
}
