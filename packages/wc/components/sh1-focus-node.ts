import { html, LitElement } from 'lit'
import type { FocusNodeState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import type { DetailsEditor } from '@hydrofoil/shaperone-core/components.js'
import FindParentCustomElementRegistry from './FindParentCustomElementRegistry.js'
import type { Dispatch } from '../store.js'

export class Sh1FocusNode extends FindParentCustomElementRegistry(LitElement) {
  @property({ type: Object })
  public focusNode: FocusNodeState | undefined

  @state()
  private dispatch: Dispatch | undefined

  constructor() {
    super()

    this.addEventListener('group-selected', ev => this.dispatch?.form.selectGroup({ focusNode: this.focusNode!.focusNode, ...ev.detail }))
    this.addEventListener('shape-selected', ev => this.dispatch?.form.selectShape({ focusNode: this.focusNode!.focusNode, ...ev.detail }))
    this.addEventListener('property-hidden', ev => this.dispatch?.form.hideProperty({ focusNode: this.focusNode!.focusNode, ...ev.detail }))
    this.addEventListener('property-shown', ev => this.dispatch?.form.showProperty({ focusNode: this.focusNode!.focusNode, ...ev.detail }))
    this.addEventListener('property-cleared', this.onPropertyCleared.bind(this))
  }

  connectedCallback() {
    super.connectedCallback()

    if (this.isDetailsEditor(this.parentElement)) {
      this.dispatch!.form.createFocusNodeState({
        focusNode: this.parentElement.value.object!,
        shape: this.parentElement.nodeShape,
      })
    }
  }

  private isDetailsEditor(element: Element | null): element is DetailsEditor {
    return this.parentElement?.tagName === 'DASH-DETAILS'
  }

  private onPropertyCleared({ detail: { shape } }: HTMLElementEventMap['property-cleared']) {
    const property = this.focusNode!.properties
      .find(property => property.shape.equals(shape))

    property?.objects.forEach((object) => {
      const args = {
        focusNode: this.focusNode!.focusNode,
        property: property.shape,
        object,
      }

      if (property.canRemove) {
        this.dispatch?.form.removeObject(args)
      } else {
        this.dispatch?.form.clearValue(args)
      }
    })
  }

  render() {
    if (!this.focusNode) {
      return html``
    }

    return html`${repeat(this.focusNode.groups, group => html`<slot name="${ifDefined(group.group?.id.value)}"></slot>`)}`
  }
}