import type { SingleEditorActions } from '@hydrofoil/shaperone-core/models/components'
import sh1 from '@hydrofoil/shaperone-core/ns.js'
import { html } from 'lit'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/option/option.js'
import type { GraphPointer } from 'clownface'
import { repeat } from 'lit/directives/repeat.js'
import type { FormSettings, PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms'
import type { SlSelect } from '@shoelace-style/shoelace'
import { renderItem } from '../lib/components.js'
import { stop } from '../lib/handlers.js'
import { settings } from '../settings.js'

interface Parameters {
  value: PropertyObjectState
  pointers: GraphPointer[]
  actions: Pick<SingleEditorActions, 'update' | 'clear'>
  property: PropertyState
  form: FormSettings
}

export function select({ actions: { update, clear }, value, pointers, property, form }: Parameters) {
  const clearable = property.shape.getBoolean(sh1.clearable)

  function onChange(e: Event) {
    const target = e.target as SlSelect
    const selected = pointers.find(({ value }) => value === target.value)

    if (selected) { update(selected.term) }
  }

  return html`<sl-select ?clearable="${clearable}"
                         .disabled="${property.shape.readOnly || false}"
                         ?hoist="${settings.hoist}"
                         .value=${value.object?.value || ''}
                         @sl-clear="${clear}"
                         @sl-change=${onChange}
                         @sl-hide=${stop}>
    ${repeat(pointers || [], renderItem(form.labelProperties))}
  </sl-select>`
}
