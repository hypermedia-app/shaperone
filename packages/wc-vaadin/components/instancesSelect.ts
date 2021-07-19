import type { Render } from '@hydrofoil/shaperone-wc'
import { html, PropertyPart, noChange } from 'lit'
import { directive, Directive } from 'lit/directive.js'
import type { InstancesSelect, InstancesSelectEditor, Item } from '@hydrofoil/shaperone-core/components'
import { SingleEditorRenderParams } from '@hydrofoil/shaperone-core/models/components'
import '@vaadin/vaadin-combo-box/vaadin-combo-box'
import type { ComboBoxDataProvider } from '@vaadin/vaadin-combo-box'
import type { GraphPointer } from 'clownface'
import { ComboBoxElement } from '@vaadin/vaadin-combo-box'
import { spread } from '@hydrofoil/shaperone-wc/lib/spread'
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

function createDataProvider(_component: InstancesSelectEditor, _renderParams: SingleEditorRenderParams<InstancesSelect>): CollectionDataProvider {
  const provider: CollectionDataProvider = async (params, callback) => {
    const pattern = new RegExp(params.filter, 'i')

    if (!provider.component.shouldLoad(provider.renderParams, params.filter)) {
      const instances = (provider.renderParams.value.componentState.instances || []).filter(([, label]) => pattern.test(label))

      callback(instances, instances.length)
      return
    }

    const choices = await provider.component.loadChoices(provider.renderParams, params.filter)
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

class DataProviderDirective extends Directive {
  dataProvider?: CollectionDataProvider
  searchUri?: string

  render(component: InstancesSelectEditor, renderParams: SingleEditorRenderParams<InstancesSelect>, searchUri: string | undefined) {
    return noChange
  }

  update(part: PropertyPart, [component, renderParams, searchUri]: Parameters<DataProviderDirective['render']>) {
    if (!this.dataProvider) {
      this.dataProvider = createDataProvider(component, renderParams)
      return this.dataProvider
    }

    if (this.searchUri && this.searchUri !== searchUri) {
      (part.element as ComboBoxElement).clearCache()
    }

    this.dataProvider.renderParams = renderParams
    this.dataProvider.component = component
    this.searchUri = searchUri
    return noChange
  }
}

const dataProvider = directive(DataProviderDirective)

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
                                ${spread(validity(value))}
                .dataProvider="${dataProvider(this, params, searchUri) as any}"
                .selectedItem="${selectedInstance}"
                @selected-item-changed="${onChange}">
  </vaadin-combo-box>`
}
