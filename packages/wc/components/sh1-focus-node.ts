import type { PropertyValues } from 'lit'
import { html } from 'lit'
import type { FocusNodeState, PropertyGroupState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import type { DetailsEditor } from '@hydrofoil/shaperone-core/components.js'
import type { FocusNode } from '@hydrofoil/shaperone-core'
import type { NodeShape } from '@rdfine/shacl'
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

  connectedCallback() {
    super.connectedCallback()

    if (this.isDetailsEditor(this.parentElement)) {
      this.initState(this.parentElement.value.object!, this.parentElement.nodeShape)
    }
  }

  protected updated(_changedProperties: PropertyValues) {
    if (_changedProperties.has('focusNode') && this.isDetailsEditor(this.parentElement)) {
      this.initState(this.parentElement.value.object!, this.parentElement.nodeShape)
    }
  }

  private initState(focusNode: FocusNode, shape: NodeShape | undefined) {
    this.dispatch!.form.createFocusNodeState({ focusNode, shape })
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
    return this.renderFocusNode()
  }

  renderFocusNode() {
    if (!this.focusNode) {
      return html``
    }

    return html`${repeat(this.focusNode.groups, this.renderGroup.bind(this))}`
  }

  renderGroup(group: PropertyGroupState) {
    return html`
      <sh1-group .focusNode="${this.focusNode}" .group="${group}">
      </sh1-group>`
  }
}
