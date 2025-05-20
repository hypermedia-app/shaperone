import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import type { GraphPointer } from 'clownface'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import sh1 from '@hydrofoil/shaperone-core/ns.js'
import type { SlSelect } from '@shoelace-style/shoelace'
import EnumSelectBase from '@hydrofoil/shaperone-wc/editors/EnumSelect.js'
import InstancesSelectBase from '@hydrofoil/shaperone-wc/editors/InstancesSelect.js'
import type { ComponentConstructor } from '@hydrofoil/shaperone-core/models/components/index.js'
import type { EnumSelectEditor } from '@hydrofoil/shaperone-core/components.js'
import { settings } from '../settings.js'
import { stop } from '../lib/handlers.js'
import { ShoelaceLoader } from './ShoelaceLoader.js'

function ShoelaceSelect<E extends ComponentConstructor<EnumSelectEditor>>(Base: E): E {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return class extends ShoelaceLoader<EnumSelectEditor>(Base) {
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
          ${repeat(this.choices, this.renderItem.bind(this))}
        </sl-select>`
    }

    renderItem(item: GraphPointer) {
      return html`
        <sl-option .value=${item.value}>
          ${localizedLabel(item, { property: this.labelProperties, fallback: item.value })}
        </sl-option>`
    }

    onChange(e: Event) {
      const target = e.target as SlSelect
      const selected = this.choices.find(({ value }) => value === target.value)

      if (selected) {
        this.setValue(selected.term)
      }
    }

    get dependencies() {
      return {
        'sl-option': import('@shoelace-style/shoelace/dist/components/option/option.component.js'),
        'sl-select': import('@shoelace-style/shoelace/dist/components/select/select.component.js'),
      }
    }
  }
}

export const EnumSelect = ShoelaceSelect(EnumSelectBase)
export const InstancesSelect = ShoelaceSelect(InstancesSelectBase)
