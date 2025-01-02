import { css, html } from 'lit'
import { createTerm } from '@hydrofoil/shaperone-core/lib/property.js'
import { property, state } from 'lit/decorators.js'
import type { FocusNodeState, PropertyObjectState, PropertyState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import type { Dispatch } from '@hydrofoil/shaperone-core/state/index.js'
import { focusNodeChanged, propertyChanged, objectChanged } from '../lib/stateChanged.js'
import ShaperoneElementBase from './ShaperoneElementBase.js'

export class Sh1Object extends ShaperoneElementBase {
  @state()
  private dispatch: Dispatch | undefined

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `
  }

  @property({ type: Object, hasChanged: objectChanged })
  private object!: PropertyObjectState

  @property({ type: Object, hasChanged: focusNodeChanged })
  private focusNode!: FocusNodeState

  @property({ type: Object, hasChanged: propertyChanged })
  private property!: PropertyState

  constructor() {
    super()

    this.addEventListener('value-changed', this.onValueChanged.bind(this))
    this.addEventListener('cleared', this.onCleared.bind(this))
    this.addEventListener('remove-object', this.onRemoved.bind(this))
    this.addEventListener('editor-selected', this.onEditorSelected.bind(this))
  }

  private onRemoved() {
    this.dispatch?.form.removeObject({
      focusNode: this.focusNode.focusNode,
      property: this.property.shape,
      object: this.object,
    })
  }

  private onEditorSelected({ detail: { editor } }: HTMLElementEventMap['editor-selected']) {
    this.dispatch?.form.selectEditor({
      focusNode: this.focusNode.focusNode,
      property: this.property.shape,
      object: this.object,
      editor,
    })
  }

  private onCleared() {
    this.dispatch?.form.clearValue({
      focusNode: this.focusNode.focusNode,
      property: this.property.shape,
      object: this.object,
    })
  }

  private onValueChanged(e: HTMLElementEventMap['value-changed']) {
    const value = typeof e.detail.value === 'string'
      ? createTerm(this.property, e.detail.value)
      : e.detail.value

    this.dispatch?.form.updateObject({
      focusNode: this.focusNode.focusNode,
      property: this.property.shape,
      object: this.object,
      newValue: value,
    })

    e.stopPropagation()
  }

  render() {
    if (!this.object || !this.property || !this.focusNode) {
      return ''
    }

    return html`
      <slot>
        <dash-text-field
          .focusNode="${this.focusNode}"
          .property="${this.property}"
          .object="${this.object}"
        ></dash-text-field>
      </slot>
      <slot name="remove-object">
      </slot>
    `
  }
}
