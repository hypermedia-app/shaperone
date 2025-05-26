import { dash, rdf } from '@tpluscode/rdf-ns-builders'
import { html } from 'lit'
import type { InstancesSelectEditor } from '@shaperone/core/components.js'
import type { NamedNode } from '@rdfjs/types'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import type { GraphPointer } from 'clownface'
import { state } from 'lit/decorators.js'
import { validity } from './lib/validity.js'
import EnumSelect from './EnumSelect.js'

export default class extends EnumSelect implements InstancesSelectEditor {
  static readonly editor: NamedNode = dash.InstancesSelectEditor

  @state()
  public selected?: GraphPointer

  protected render(): unknown {
    return html`<select ?disabled="${this.readonly}" @input="${this.selectionChanged}" required ${validity(this.value)}>
      <option value=""></option>
      ${this.choices.map(pointer => html`
        <option ?selected="${pointer.value === this.value.object?.value}" value="${pointer.value}">
          ${localizedLabel(pointer, { fallback: pointer.value })}
        </option>`)}
    </select>`
  }

  selectionChanged(e: any) {
    const { selectedIndex } = e.target
    if (selectedIndex === 0) {
      this.clear()
    } else {
      this.selected = this.choices[(e.target).selectedIndex - 1]
      this.setValue(this.selected?.term)
    }
  }

  setChoices() {
    const property = this.property.shape
    if (property.class) {
      this.choices = property.pointer.any()
        .has(rdf.type, property.class.id)
        .toArray()
    } else {
      this.choices = []
    }
  }
}
