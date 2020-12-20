import type { RenderSingleEditor } from '@hydrofoil/shaperone-wc'
import { html } from 'lit-html'
import { InstancesSelect, InstancesSelectEditor } from '@hydrofoil/shaperone-core/components'
import '@vaadin/vaadin-combo-box/vaadin-combo-box'
import { FocusNode } from '@hydrofoil/shaperone-core'
import type { PropertyShape } from '@rdfine/shacl'
import { FormSettings } from '@hydrofoil/shaperone-core/models/forms'
import type { ComboBoxDataProvider } from '@vaadin/vaadin-combo-box'
import type { GraphPointer } from 'clownface'

function dataProvider(component: InstancesSelectEditor, form: FormSettings, focusNode: FocusNode, property: PropertyShape): ComboBoxDataProvider {
  return async (params, callback) => {
    const choices = await component.loadChoices({ focusNode, property })
    const items = choices
      .map(pointer => ({ value: pointer, label: component.label(pointer, form) }))
      .sort((l, r) => l.label.localeCompare(r.label))

    callback(items, items.length)
  }
}

export const instancesSelect: RenderSingleEditor<InstancesSelect> = function (this: InstancesSelectEditor, { form, focusNode, property, value }, actions) {
  let selectedItem: { label: string; value: GraphPointer } | undefined
  if (value.componentState.selectedInstance) {
    selectedItem = {
      label: value.componentState.selectedInstance[1],
      value: value.componentState.selectedInstance[0],
    }
  }

  if (value.object && !selectedItem) {
    let label = this.label(value.object, form)
    if (label === value.object.value) {
      label = this.label(property.shape.pointer.node(value.object), form)
    }

    selectedItem = {
      value: value.object,
      label,
    }
  }

  function onChange(e: any) {
    if (e.target.selectedItem && !e.target.selectedItem.value.term.equals(value.object?.term)) {
      actions.update(e.target.selectedItem.value.term)
      actions.updateComponentState({
        selectedInstance: [
          e.target.selectedItem.value,
          e.target.selectedItem.label,
        ],
      })
    }
  }

  return html`<vaadin-combo-box item-id-path="value.value"
                .dataProvider="${dataProvider(this, form, focusNode, property.shape)}"
                .selectedItem="${selectedItem}"
                @selected-item-changed="${onChange}">
  </vaadin-combo-box>`
}
