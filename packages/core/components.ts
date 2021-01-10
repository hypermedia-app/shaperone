/**
 * Exports base implementation of come components so that they can be easily completed by adding the `render` or `lazyRender` method
 *
 * @packageDocumentation
 * @module @hydrofoil/shaperone-core/components
 */

import { PropertyShape } from '@rdfine/shacl'
import { GraphPointer } from 'clownface'
import { dash, rdf } from '@tpluscode/rdf-ns-builders'
import { SingleEditorComponent, SingleEditorRenderParams } from './models/components'
import { FocusNode } from './index'
import { FormSettings } from './models/forms'
import { sort, label } from './lib/components'

type CoreComponents<T> = Omit<T, 'render' | 'lazyRender'>

export type Item = [GraphPointer, string]

/**
 * Represents the state of an enum select component
 */
export interface EnumSelect {
  ready?: boolean
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
   * Return the displayed label for an enum choice
   * @param choice
   * @param form
   */
  label(choice: GraphPointer, form: Pick<FormSettings, 'labelProperties' | 'languages'>): string

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
export const enumSelect: CoreComponents<EnumSelectEditor> = {
  editor: dash.EnumSelectEditor,
  init({ focusNode, form, property, value: { componentState }, updateComponentState }) {
    if (!componentState.choices && !componentState.loading) {
      updateComponentState({
        loading: true,
      });
      (async () => {
        const pointers = await this.loadChoices({ focusNode, property: property.shape })
        const choices = pointers.map<Item>(ptr => [ptr, this.label(ptr, form)])
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
  label,
  sort,
}

/**
 * Represents the state of an instances select component
 */
export interface InstancesSelect {
  ready?: boolean
  instances?: Item[]
  loading?: boolean
}

export interface InstancesSelectEditor extends SingleEditorComponent<InstancesSelect, any> {
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
   */
  loadChoices(params: SingleEditorRenderParams<InstancesSelect>): Promise<GraphPointer[]>

  /**
   * Returns a logical value to determine if the component should fetch fresh collection of instances
   * @param params
   */
  shouldLoad(params: SingleEditorRenderParams<InstancesSelect>): boolean
  label(choice: GraphPointer, form: Pick<FormSettings, 'labelProperties' | 'languages'>): string
  sort(left: Item, right: Item): number
}

/**
 * A base implementation of Instances Select component which sets {@link InstancesSelect.ready} state flag the instances are first loaded.
 *
 * The instance data will be loaded from the shapes graph
 */
export const instancesSelect: CoreComponents<InstancesSelectEditor> = {
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
          .sort(([, left], [, right]) => left.localeCompare(right))

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
