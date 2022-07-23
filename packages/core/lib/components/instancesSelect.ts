import type { PropertyShape } from '@rdfine/shacl'
import type { GraphPointer } from 'clownface'
import { dash, rdf } from '@tpluscode/rdf-ns-builders'
import { ComponentInstance, SingleEditorComponent, SingleEditorRenderParams } from '../../models/components'
import { CoreComponent, sort } from '../components.js'

/**
 * Represents the state of an instances select component
 */
export interface InstancesSelect extends ComponentInstance {
  instances?: GraphPointer[]
  loading?: boolean
}

export interface InstancesSelectEditor extends SingleEditorComponent<InstancesSelect> {
  /**
   * Asynchronously loads an instance selected in the editor
   *
   * Implementors may choose to implement and call it if the local state does not have full representation of the resource
   * @param params
   */
  loadInstance(params: {
    property: PropertyShape
    value: GraphPointer
  }): Promise<GraphPointer | null>
  /**
   * Asynchronously load the values for the component
   * @param params
   * @param freetextQuery user input mapped to `hydra:freetextQuery` template property
   */
  loadChoices(params: SingleEditorRenderParams<InstancesSelect>, freetextQuery?: string): Promise<GraphPointer[]>

  /**
   * Returns a logical value to determine if the component should fetch fresh collection of instances
   * @param params
   * @param freetextQuery user input mapped to `hydra:freetextQuery` template property
   */
  shouldLoad(params: SingleEditorRenderParams<InstancesSelect>, freetextQuery?: string): boolean
  sort(left: GraphPointer, right: GraphPointer): number
}

/**
 * A base implementation of Instances Select component which sets {@link InstancesSelect.ready} state flag the instances are first loaded.
 *
 * The instance data will be loaded from the shapes graph
 */
export const instancesSelect: CoreComponent<InstancesSelectEditor> = {
  editor: dash.InstancesSelectEditor,
  shouldLoad({ value: { componentState } }): boolean {
    return !componentState.instances
  },
  init(params) {
    const { value, updateComponentState } = params
    if (this.shouldLoad(params) && !value.componentState.loading) {
      updateComponentState({
        loading: true,
      });
      (async () => {
        const pointers = await this.loadChoices(params)
        const instances = pointers.sort(this.sort)

        updateComponentState({
          instances,
          ready: true,
          loading: false,
        })
      })()

      return false
    }
    return !value.componentState.loading
  },
  async loadInstance({ property, value }) {
    return property.pointer.node(value)
  },
  async loadChoices({ property }) {
    if (property.shape.class) {
      return property.shape.pointer.any()
        .has(rdf.type, property.shape.class.id)
        .toArray()
    }

    return []
  },
  sort,
}
