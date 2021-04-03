import type { Render } from '@hydrofoil/shaperone-wc'
import { directive, html, PropertyPart } from 'lit-html'
import type { InstancesSelect, InstancesSelectEditor, Item } from '@hydrofoil/shaperone-core/components'
import { SingleEditorRenderParams } from '@hydrofoil/shaperone-core/models/components'
import '@vaadin/vaadin-combo-box/vaadin-combo-box'
import type { ComboBoxDataProvider } from '@vaadin/vaadin-combo-box'
import type { GraphPointer } from 'clownface'
import { ComboBoxElement } from '@vaadin/vaadin-combo-box'
import { spread } from '@open-wc/lit-helpers'
import { validity } from './validation'

declare module '@hydrofoil/shaperone-core/components' {
  interface InstancesSelect {
    /**
     * The currently selected instance
     *
     * @category vaadin
     */
    selectedInstance?: Item
  }
}

type CollectionDataProvider = ComboBoxDataProvider & {
  component: InstancesSelectEditor
  renderParams: SingleEditorRenderParams<InstancesSelect>
}

function dataProvider(_component: InstancesSelectEditor, _renderParams: SingleEditorRenderParams<InstancesSelect>): CollectionDataProvider {
  const provider: CollectionDataProvider = async (params, callback) => {
    const pattern = new RegExp(params.filter, 'i')

    if (!provider.component.shouldLoad(provider.renderParams)) {
      const instances = (provider.renderParams.value.componentState.instances || []).filter(([, label]) => pattern.test(label))

      callback(instances, instances.length)
      return
    }

    const choices = await provider.component.loadChoices(provider.renderParams)
    const instances = choices.map<[GraphPointer, string]>(pointer => [pointer, provider.component.label(pointer, provider.renderParams.form)])
    const items = instances
      .filter(([, label]) => pattern.test(label))
      .sort(([, l], [, r]) => l.localeCompare(r))

    callback(items, items.length)
    provider.renderParams.updateComponentState({
      instances,
    })
  }

  provider.renderParams = _renderParams
  provider.component = _component

  return provider
}

const stateMap = new WeakMap<PropertyPart, { dataProvider: CollectionDataProvider ; searchUri: string | undefined }>()
const memoizeDataProvider = directive((component: InstancesSelectEditor, renderParams: SingleEditorRenderParams<InstancesSelect>, searchUri: string | undefined) => (part: PropertyPart) => {
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

export const instancesSelect: Render<InstancesSelectEditor> = function (params, actions) {
  const { form, focusNode, property, value } = params
  let selectedInstance: [GraphPointer, string] | undefined
  if (value.componentState.selectedInstance) {
    selectedInstance = value.componentState.selectedInstance
  }

  if (value.object && !selectedInstance) {
    let label = this.label(value.object, form)
    if (label === value.object.value) {
      label = this.label(property.shape.pointer.node(value.object), form)
    }

    selectedInstance = [value.object, label]
  }

  function onChange(e: any) {
    const selectedInstance = e.target.selectedItem as [GraphPointer, string] | undefined

    if (selectedInstance && !selectedInstance[0].term.equals(value.object?.term)) {
      actions.update(selectedInstance[0].term)
      params.updateComponentState({
        selectedInstance,
      })
    }
  }

  const searchUri = this.searchTemplate?.({ property })?.expand(focusNode)

  return html`<vaadin-combo-box item-id-path="0.value" item-label-path="1"
                                ...="${spread(validity(value))}"
                .dataProvider="${memoizeDataProvider(this, params, searchUri)}"
                .selectedItem="${selectedInstance}"
                @selected-item-changed="${onChange}">
  </vaadin-combo-box>`
}
