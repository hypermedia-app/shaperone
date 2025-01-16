import type { FocusNodeState, PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { css, html } from 'lit'
import { property } from 'lit/decorators.js'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { sh } from '@tpluscode/rdf-ns-builders'
import { repeat } from 'lit/directives/repeat.js'
import ShaperoneElementBase from './ShaperoneElementBase.js'

export class Sh1Property extends ShaperoneElementBase {
  static get styles() {
    return css`
      :host {
        display: flex;
        align-content: space-between;
      }

      .label {
        flex: 1;
      }

      .objects {
        text-align: end;
      }

      :host(:not([can-add])) #add-object {
        display: none;
      }
    `
  }

  @property({ type: Object })
  public focusNode!: FocusNodeState

  @property({ type: Object })
  public property!: PropertyState

  constructor() {
    super()

    this.addEventListener('add-object', this.onAddObject.bind(this))
    this.addEventListener('multi-editors-selected', this.onSwitchToMultiEditor.bind(this))
    this.addEventListener('single-editors-selected', this.onSwitchToSingleEditors.bind(this))
  }

  private onSwitchToMultiEditor() {
    this.dispatch!.form.selectMultiEditor({
      focusNode: this.focusNode.focusNode,
      property: this.property.shape,
    })
  }

  private onSwitchToSingleEditors() {
    this.dispatch!.form.selectSingleEditors({
      focusNode: this.focusNode.focusNode,
      property: this.property.shape,
    })
  }

  private onAddObject() {
    this.dispatch!.form.addObject({
      focusNode: this.focusNode.focusNode,
      property: this.property.shape,
    })
  }

  render() {
    return html`
      <div class="label">
        <slot name="label">
          <label for="${this.property.shape.id.value}">
            ${localizedLabel(this.property.shape, { property: sh.name })}
          </label>
        </slot>
      </div>
      <div class="objects">
        ${this.renderObjects()}
        ${this.renderAddButton()}
      </div>
    `
  }

  renderObjects() {
    return html`${repeat(this.property.objects, this.renderObject.bind(this))}`
  }

  renderObject(object: PropertyObjectState) {
    return html`<sh1-object .focusNode="${this.focusNode}"
                            .object="${object}"
                            .property="${this.property}"></sh1-object>`
  }

  renderAddButton() {
    if (this.property.canAdd) {
      return html`<sh1-button slot="add-object" kind="add-object">
        + ${localizedLabel(this.property.shape, { property: sh.name })}
      </sh1-button>`
    }

    return ''
  }
}
