import type { PropertyShape } from '@rdfine/shacl'
import type { GraphPointer } from 'clownface'
import { dash } from '@tpluscode/rdf-ns-builders'
import type { ComponentInstance, SingleEditorComponent } from '../../models/components/index.js'
import type { FocusNode } from '../../index.js'
import type { CoreComponent } from '../components.js'
import { sort } from '../components.js'
import type { ShaperoneEnvironment } from '../../env.js'

/**
 * Represents the state of an enum select component
 */
export interface EnumSelect extends ComponentInstance {
  choices?: GraphPointer[]
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

  sort(shape: PropertyShape, env: ShaperoneEnvironment): (left: GraphPointer, right: GraphPointer) => number
}

/**
 * A base implementation of Enum Select component which sets {@link EnumSelect.ready} state flag the choices are first loaded
 *
 * The enums data (in case of Named Node values) will be loaded from the shapes graph
 */
export const enumSelect: CoreComponent<EnumSelectEditor> = {
  editor: dash.EnumSelectEditor,
  init({ env, focusNode, property, componentState, updateComponentState }) {
    if (!componentState.choices && !componentState.loading) {
      updateComponentState({
        loading: true,
      });
      (async () => {
        const pointers = await this.loadChoices({ focusNode, property: property.shape })
        const choices = pointers.sort(this.sort(property.shape, env))

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
