import type { PropertyShape } from '@rdfine/shacl'
import type { GraphPointer } from 'clownface'
import { dash, rdf } from '@tpluscode/rdf-ns-builders'
import { ComponentInstance, SingleEditorComponent, SingleEditorRenderParams } from '../../models/components'
import { FormSettings } from '../../models/forms'
import { CoreComponent, label, sort, Item } from '../components'

/**
 * Represents the state of an instances select component
 */
export interface InstancesSelect extends ComponentInstance {
  instances?: Item[]
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
  label(choice: GraphPointer, form: Pick<FormSettings, 'labelProperties' | 'languages'>): string
  sort(left: Item, right: Item): number
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
    const { form, value, updateComponentState } = params
    if (this.shouldLoad(params) && !value.componentState.loading) {
      updateComponentState({
        loading: true,
      });
      (async () => {
        const pointers = await this.loadChoices(params)
        const instances = pointers.map<Item>(ptr => [ptr, this.label(ptr, form)])
          .sort(this.sort)

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
  label,
  sort,
}
