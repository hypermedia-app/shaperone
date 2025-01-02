import type { FocusNodeState, PropertyState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { css, html } from 'lit'
import { property, state } from 'lit/decorators.js'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { sh } from '@tpluscode/rdf-ns-builders'
import type { Dispatch } from '../store.js'
import { focusNodeChanged, propertyChanged } from '../lib/stateChanged.js'
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

      :host(:not([can-add])) slot[name=add-object] {
        display: none;
      }
    `
  }

  @property({ type: Object, hasChanged: focusNodeChanged })
  public focusNode!: FocusNodeState

  @property({ type: Object, hasChanged: propertyChanged })
  public property!: PropertyState

  @state()
  protected dispatch!: Dispatch

  constructor() {
    super()

    this.addEventListener('add-object', this.onAddObject.bind(this))
    this.addEventListener('multi-editors-selected', this.onSwitchToMultiEditor.bind(this))
    this.addEventListener('single-editors-selected', this.onSwitchToSingleEditors.bind(this))
  }

  private onSwitchToMultiEditor() {
    this.dispatch.form.selectMultiEditor({
      focusNode: this.focusNode.focusNode,
      property: this.property.shape,
    })
  }

  private onSwitchToSingleEditors() {
    this.dispatch.form.selectSingleEditors({
      focusNode: this.focusNode.focusNode,
      property: this.property.shape,
    })
  }

  private onAddObject() {
    this.dispatch.form.addObject({
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
        <slot></slot>
        <slot name="add-object">
        </slot>
      </div>
    `
  }
}
