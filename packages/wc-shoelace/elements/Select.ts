
import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import type { NamedNode } from '@rdfjs/types'
import type { GraphPointer } from 'clownface'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import sh1 from '@hydrofoil/shaperone-core/ns.js'
import type { SlSelect } from '@shoelace-style/shoelace'
import EnumSelect from '@hydrofoil/shaperone-wc/elements/EnumSelect.js'
import InstancesSelect from '@hydrofoil/shaperone-wc/elements/InstancesSelect.js'
import { settings } from '../settings.js'
import { stop } from '../lib/handlers.js'
import { ShoelaceLoader } from './ShoelaceLoader.js'

type Constructor<T> = new (...args: any[]) => T

function ShoelaceSelect<E extends Constructor<EnumSelect>>(Base: E): E {
  return class extends ShoelaceLoader(Base) {
    private get clearable() {
      return this.property.shape.getBoolean(sh1.clearable)
    }

    render() {
      return html`
        <sl-select ?clearable="${this.clearable}"
                   .disabled="${this.property.shape.readOnly || false}"
                   ?hoist="${settings.hoist}"
                   .value=${this.value.object?.value || ''}
                   @sl-clear="${this.clear}"
                   @sl-change=${this.onChange}
                   @sl-hide=${stop}>
          ${repeat(this.choices, this.renderItem())}
        </sl-select>`
    }

    renderItem(property?: NamedNode | NamedNode[]) {
      return (item: GraphPointer) => html`
        <sl-option .value=${item.value}>
          ${localizedLabel(item, { property, fallback: item.value })}
        </sl-option>`
    }

    onChange(e: Event) {
      const target = e.target as SlSelect
      const selected = this.choices.find(({ value }) => value === target.value)

      if (selected) {
        this.setValue(selected.term)
      }
    }

    * dependencies() {
      yield import('@shoelace-style/shoelace/dist/components/option/option.js')
      yield import('@shoelace-style/shoelace/dist/components/select/select.js')
    }
  }
}

export const Enum = ShoelaceSelect(EnumSelect)
export const Select = ShoelaceSelect(InstancesSelect)
