import type { Render } from '@hydrofoil/shaperone-wc'
import { html, PropertyPart, noChange } from 'lit'
import { directive, Directive } from 'lit/directive.js'
import type { AutoComplete, InstancesSelect, InstancesSelectEditor } from '@hydrofoil/shaperone-core/components.js'
import { SingleEditorRenderParams } from '@hydrofoil/shaperone-core/models/components'
import '@vaadin/vaadin-combo-box/vaadin-combo-box'
import type { ComboBoxDataProvider } from '@vaadin/vaadin-combo-box'
import type { GraphPointer } from 'clownface'
import { ComboBoxElement } from '@vaadin/vaadin-combo-box'
import { spread } from '@hydrofoil/shaperone-wc/lib/spread.js'
import { getLocalizedLabel } from '@rdfjs-elements/lit-helpers'
import { validity } from './validation.js'

declare module '@hydrofoil/shaperone-core/components.js' {
  interface InstancesSelect {
    /**
     * The currently selected instance
     *
     * @category vaadin
     */
    selectedInstance?: GraphPointer
  }
}

type Item = [GraphPointer, string]

type CollectionDataProvider = ComboBoxDataProvider<Item> & {
  component: InstancesSelectEditor
  renderParams: SingleEditorRenderParams<InstancesSelect | AutoComplete>
}

function createDataProvider(_component: InstancesSelectEditor, _renderParams: SingleEditorRenderParams<InstancesSelect>): CollectionDataProvider {
  const provider: CollectionDataProvider = async (params, callback) => {
    const pattern = new RegExp(params.filter, 'i')

    provider.renderParams.updateComponentState({
      freetextQuery: params.filter,
    })

    let instances = provider.renderParams.componentState.instances || []

    if (provider.component.shouldLoad(provider.renderParams)) {
      instances = await provider.component.loadChoices(provider.renderParams)
    }

    const items = instances
      .map<Item>(pointer => [pointer, getLocalizedLabel(pointer.out(_renderParams.env.ns.rdfs.label))])
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
  const { env, focusNode, property, value, componentState } = params
  let selectedInstance: GraphPointer | undefined
  if (componentState.selectedInstance) {
    selectedInstance = componentState.selectedInstance
  }

  if (value.object && !selectedInstance) {
    selectedInstance = value.object
  }

  function onChange(e: any) {
    const selectedItem = e.target.selectedItem as Item | GraphPointer | undefined
    const selectedInstance = Array.isArray(selectedItem)
      ? selectedItem[0]
      : selectedItem

    if (selectedInstance && !selectedInstance.term.equals(value.object?.term)) {
      actions.update(selectedInstance.term)
      params.updateComponentState({
        selectedInstance,
      })
    }
  }

  const searchUri = this.searchTemplate?.({ property })?.expand(focusNode)
  const selectedItem = selectedInstance
    ? [selectedInstance, getLocalizedLabel(selectedInstance.out(env.ns.rdfs.label))]
    : []

  return html`<vaadin-combo-box item-id-path="0.value" item-label-path="1"
                                ${spread(validity(value))}
                                .readonly="${!!property.shape.readOnly}"
                .dataProvider="${dataProvider(this, params, searchUri) as any}"
                .selectedItem="${selectedItem}"
                @selected-item-changed="${onChange}">
  </vaadin-combo-box>`
}
