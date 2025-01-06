import type { FocusNodeState, PropertyGroupState, PropertyState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { property } from 'lit/decorators.js'
import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import type { PropertyGroup } from '@rdfine/shacl'
import ShaperoneElementBase from './ShaperoneElementBase.js'

export class Sh1Group extends ShaperoneElementBase {
  @property({ type: Object })
  public focusNode: FocusNodeState | undefined

  @property({ type: Object })
  private group!: PropertyGroupState

  render() {
    return this.renderGroup()
  }

  renderGroup() {
    const properties = this.focusNode?.properties
      .filter(({ hidden }) => !hidden)
      .filter(byGroup(this.group?.group))
      .filter(onlySingleProperty)

    return html`${repeat(properties || [], this.renderProperty.bind(this))}`
  }

  renderProperty(property: PropertyState) {
    return html`
      <sh1-property ?can-add="${property.canAdd}" .focusNode="${this.focusNode}" .property="${property}">
      </sh1-property>`
  }
}

function byGroup(group: PropertyGroup | undefined) {
  return (property: PropertyState) => {
    if (!group && !property.shape.group) {
      return true
    }

    if (group && property.shape.group) {
      return group.id.equals(property.shape.group.id)
    }

    return false
  }
}

function onlySingleProperty(property: PropertyState) {
  if (Array.isArray(property.shape.path)) {
    return property.shape.path.length === 1
  }

  return true
}
