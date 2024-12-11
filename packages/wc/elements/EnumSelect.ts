import { dash } from '@tpluscode/rdf-ns-builders'
import { html } from 'lit'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { repeat } from 'lit/directives/repeat.js'
import { property } from 'lit/decorators.js'
import type { GraphPointer } from 'clownface'
import { sort } from '@hydrofoil/shaperone-core/lib/components.js'
import type { EnumSelectEditor } from '@hydrofoil/shaperone-core/lib/components/enumSelect.js'
import { SingleEditorBase } from './SingleEditorBase.js'
import { validity } from '../components/validity.js'
import { readOnly } from '../components/readonly.js'

export default class extends SingleEditorBase implements EnumSelectEditor {
  static readonly editor = dash.EnumSelectEditor

  @property({ type: Array })
  public choices: GraphPointer[] = []

  connectedCallback() {
    super.connectedCallback()

    this.setChoices()
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

  private selectionChanged(e: any) {
    const chosen = this.choices[(e.target).selectedIndex - 1]
    if (chosen) {
      this.setValue(chosen.term)
    }
  }

  private async setChoices() {
    const pointers: GraphPointer[] = await this.loadChoices()
    this.choices = pointers.sort(sort(this.property.shape))
  }

  async loadChoices(): Promise<GraphPointer[]> {
    return this.property.shape.pointer.node(this.property.shape.in).toArray()
  }
}
