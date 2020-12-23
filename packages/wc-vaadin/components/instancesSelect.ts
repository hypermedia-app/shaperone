import type { RenderSingleEditor } from '@hydrofoil/shaperone-wc'
import { directive, html, PropertyPart } from 'lit-html'
import { InstancesSelect, InstancesSelectEditor } from '@hydrofoil/shaperone-core/components'
import { SingleEditorRenderParams } from '@hydrofoil/shaperone-core/models/components'
import '@vaadin/vaadin-combo-box/vaadin-combo-box'
import type { ComboBoxDataProvider } from '@vaadin/vaadin-combo-box'
import type { GraphPointer } from 'clownface'
import { ComboBoxElement } from '@vaadin/vaadin-combo-box'

function dataProvider(component: InstancesSelectEditor, renderParams: SingleEditorRenderParams): ComboBoxDataProvider {
  return async (params, callback) => {
    const choices = await component.loadChoices(renderParams)
    const items = choices
      .map(pointer => ({ value: pointer, label: component.label(pointer, renderParams.form) }))
      .sort((l, r) => l.label.localeCompare(r.label))

    callback(items, items.length)
  }
}

const stateMap = new WeakMap()
const clearDataProvider = directive((searchUri: string | undefined) => (part: PropertyPart) => {
  if (!searchUri) return

  const previousUri = stateMap.get(part)
  if (previousUri && previousUri !== searchUri) {
    (part.committer.element as ComboBoxElement).clearCache()
  }

  stateMap.set(part, searchUri)
  part.setValue(searchUri)
})

export const instancesSelect: RenderSingleEditor<InstancesSelect> = function (this: InstancesSelectEditor, params, actions) {
  const { form, focusNode, property, value } = params
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
      params.updateComponentState({
        selectedInstance: [
          e.target.selectedItem.value,
          e.target.selectedItem.label,
        ],
      })
    }
  }

  const searchUri = this.searchTemplate?.({ property })?.expand(focusNode)

  return html`<vaadin-combo-box item-id-path="value.value"
                .lastSearchUri="${clearDataProvider(searchUri)}"
                .dataProvider="${dataProvider(this, params)}"
                .selectedItem="${selectedItem}"
                @selected-item-changed="${onChange}">
  </vaadin-combo-box>`
}
