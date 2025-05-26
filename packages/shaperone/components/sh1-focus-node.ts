import { html } from 'lit'
import type { FocusNodeState, PropertyGroupState } from '@shaperone/core/models/forms/index.js'
import { property } from 'lit/decorators.js'
import ShaperoneElementBase from './ShaperoneElementBase.js'

export class Sh1FocusNode extends ShaperoneElementBase {
  @property({ type: Object })
  public focusNode: FocusNodeState | undefined

  constructor() {
    super()

    this.addEventListener('group-selected', ev => this.dispatch?.form.selectGroup({ focusNode: this.focusNode!.focusNode, ...ev.detail }))
    this.addEventListener('shape-selected', ev => this.dispatch?.form.selectShape({ focusNode: this.focusNode!.focusNode, ...ev.detail }))
    this.addEventListener('property-hidden', ev => this.dispatch?.form.hideProperty({ focusNode: this.focusNode!.focusNode, ...ev.detail }))
    this.addEventListener('property-shown', ev => this.dispatch?.form.showProperty({ focusNode: this.focusNode!.focusNode, ...ev.detail }))
    this.addEventListener('property-cleared', this.onPropertyCleared.bind(this))
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
    return this.renderFocusNode()
  }

  renderFocusNode() {
    if (!this.focusNode) {
      return html``
    }

    return html`${this.focusNode.groups.map(this.renderGroup.bind(this))}`
  }

  renderGroup(group: PropertyGroupState) {
    return html`
      <sh1-group .focusNode="${this.focusNode}" .group="${group}">
      </sh1-group>`
  }
}
