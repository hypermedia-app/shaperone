import { dash } from '@tpluscode/rdf-ns-builders'
import type { PropertyValues } from 'lit'
import { html } from 'lit'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { repeat } from 'lit/directives/repeat.js'
import { sort } from '@hydrofoil/shaperone-core/lib/components.js'
import type { EnumSelectEditor } from '@hydrofoil/shaperone-core/components.js'
import type { NamedNode } from '@rdfjs/types'
import type { GraphPointer } from 'clownface'
import { property } from 'lit/decorators.js'
import { SingleEditorBase } from './SingleEditorBase.js'
import { validity } from './lib/validity.js'
import { readOnly } from './lib/readonly.js'

const choices = Symbol('choices')

export default class extends SingleEditorBase implements EnumSelectEditor {
  private [choices]: GraphPointer[] = []

  static readonly editor: NamedNode = dash.EnumSelectEditor

  @property({ type: Array, state: true })
  get choices() {
    return this[choices]
  }

  set choices(value: GraphPointer[]) {
    this[choices] = value.sort(sort(this.property.shape))
  }

  protected updated(_changedProperties: PropertyValues) {
    if (this.shouldLoadChoices(_changedProperties)) {
      this.setChoices()
    }
  }

  protected render(): unknown {
    return html`<select ${readOnly(this.property)} @input="${this.selectionChanged}" required ${validity(this.value)}>
      <option value=""></option>
      ${repeat(this.choices, pointer => html`
        <option ?selected="${pointer.value === this.value.object?.value}" value="${pointer.value}">
          ${localizedLabel(pointer, { fallback: pointer.value })}
        </option>`)}
    </select>`
  }

  selectionChanged(e: any) {
    const chosen = this.choices[(e.target).selectedIndex - 1]
    if (chosen) {
      this.setValue(chosen.term)
    }
  }

  protected shouldLoadChoices(_changedProperties: PropertyValues) {
    if (!_changedProperties.has('property')) {
      return false
    }

    const propertyAfter = this.property
    const propertyBefore: typeof propertyAfter | undefined = _changedProperties.get('property')

    return !propertyAfter.shape.id.equals(propertyBefore?.shape.id)
  }

  setChoices() {
    const property = this.property.shape
    this.choices = property.pointer.node(property.in).toArray()
  }
}
