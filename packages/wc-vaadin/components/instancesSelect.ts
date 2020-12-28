import type { RenderSingleEditor } from '@hydrofoil/shaperone-wc'
import { directive, html, PropertyPart } from 'lit-html'
import { InstancesSelect, InstancesSelectEditor } from '@hydrofoil/shaperone-core/components'
import { SingleEditorRenderParams } from '@hydrofoil/shaperone-core/models/components'
import '@vaadin/vaadin-combo-box/vaadin-combo-box'
import type { ComboBoxDataProvider } from '@vaadin/vaadin-combo-box'
import type { GraphPointer } from 'clownface'
import { ComboBoxElement } from '@vaadin/vaadin-combo-box'

type CollectionDataProvider = ComboBoxDataProvider & {
  component: InstancesSelectEditor
  renderParams: SingleEditorRenderParams
}

function dataProvider(_component: InstancesSelectEditor, _renderParams: SingleEditorRenderParams): CollectionDataProvider {
  const provider: CollectionDataProvider = async (params, callback) => {
    if (!provider.component.shouldLoad(provider.renderParams)) {
      // eslint-disable-next-line standard/no-callback-literal
      callback([], 0)
      return
    }

    const pattern = new RegExp(params.filter, 'i')
    const choices = await provider.component.loadChoices(provider.renderParams)
    const items = choices
      .map(pointer => ({ value: pointer, label: provider.component.label(pointer, provider.renderParams.form) }))
      .filter(({ label }) => pattern.test(label))
      .sort((l, r) => l.label.localeCompare(r.label))

    callback(items, items.length)
  }

  provider.renderParams = _renderParams
  provider.component = _component

  return provider
}

const stateMap = new WeakMap<PropertyPart, { dataProvider: CollectionDataProvider ; searchUri: string | undefined }>()
const memoizeDataProvider = directive((component: InstancesSelectEditor, renderParams: SingleEditorRenderParams, searchUri: string | undefined) => (part: PropertyPart) => {
  const previous = stateMap.get(part)
  if (previous) {
    // do not create a new data provider function to prevent duplicate requests from <vaadin-comb-box>
    if (previous.searchUri && previous.searchUri !== searchUri) {
      (part.committer.element as ComboBoxElement).clearCache()
    }
    previous.dataProvider.renderParams = renderParams
    previous.dataProvider.component = component
    previous.searchUri = searchUri
    return
  }

  const state = {
    dataProvider: dataProvider(component, renderParams),
    searchUri,
  }
  stateMap.set(part, state)
  part.setValue(state.dataProvider)
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
                .dataProvider="${memoizeDataProvider(this, params, searchUri)}"
                .selectedItem="${selectedItem}"
                @selected-item-changed="${onChange}">
  </vaadin-combo-box>`
}
