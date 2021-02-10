import type { PropertyShape } from '@rdfine/shacl'
import type { GraphPointer } from 'clownface'
import { dash } from '@tpluscode/rdf-ns-builders'
import { ComponentInstance, SingleEditorComponent } from '../../models/components'
import { FocusNode } from '../../index'
import { CoreComponent, Item, sort } from '../components'

/**
 * Represents the state of an enum select component
 */
export interface EnumSelect extends ComponentInstance {
  choices?: Item[]
  loading?: boolean
}

/**
 * An interface for implementing dash:EnumSelectEditor
 */
export interface EnumSelectEditor extends SingleEditorComponent<EnumSelect> {
  /**
   * Asynchronously load the values for the component
   * @param params
   */
  loadChoices(params: {
    focusNode: FocusNode
    property: PropertyShape
  }): Promise<GraphPointer[]>

  /**
   * Sorting function to order the component elements
   * @param left
   * @param right
   */
  sort(left: Item, right: Item): number
}

/**
 * A base implementation of Enum Select component which sets {@link EnumSelect.ready} state flag the choices are first loaded
 *
 * The enums data (in case of Named Node values) will be loaded from the shapes graph
 */
export const enumSelect: CoreComponent<EnumSelectEditor> = {
  editor: dash.EnumSelectEditor,
  init({ focusNode, property, value: { componentState }, updateComponentState, renderer }) {
    if (!componentState.choices && !componentState.loading) {
      updateComponentState({
        loading: true,
      });
      (async () => {
        const pointers = await this.loadChoices({ focusNode, property: property.shape })
        const choices = pointers.map<Item>(ptr => [ptr, renderer.context.templates.meta.label.call(renderer, ptr) || ptr.value])
          .sort(this.sort)

        updateComponentState({
          choices,
          ready: true,
          loading: false,
        })
      })()

      return false
    }
    return !componentState.loading
  },
  async loadChoices({ property }) {
    return property.pointer.node(property.in).toArray()
  },
  sort,
}
