import { PropertyShape } from '@rdfine/shacl'
import { GraphPointer } from 'clownface'
import { dash, rdf } from '@tpluscode/rdf-ns-builders'
import { SingleEditorComponent } from './models/components'
import { FocusNode } from './index'
import { FormSettings } from './models/forms'

type CoreComponents<T> = Omit<T, 'render' | 'lazyRender'>

export interface EnumSelect {
  ready?: boolean
  choices?: [GraphPointer, string][]
  loading?: boolean
}

export interface EnumSelectEditor extends SingleEditorComponent<EnumSelect, any> {
  loadChoices(params: {
    focusNode: FocusNode
    property: PropertyShape
  }): Promise<GraphPointer[]>
  label(choice: GraphPointer, form: Pick<FormSettings, 'labelProperties' | 'languages'>): string
}

export const enumSelect: CoreComponents<EnumSelectEditor> = {
  editor: dash.EnumSelectEditor,
  async init({ focusNode, form, property, value: { componentState }, updateComponentState }) {
    if (!componentState.choices && !componentState.loading) {
      updateComponentState({
        loading: true,
      })

      const pointers = await this.loadChoices({ focusNode, property: property.shape })
      const choices = pointers.map<[GraphPointer, string]>(ptr => [ptr, this.label(ptr, form)])
        .sort(([, left], [, right]) => left.localeCompare(right))

      updateComponentState({
        choices,
        ready: true,
        loading: false,
      })
    }
  },
  async loadChoices({ property }) {
    return property.pointer.node(property.in).toArray()
  },
  label(choice, { languages, labelProperties }) {
    return choice.out(labelProperties, { language: [...languages, ''] }).values[0] || choice.value
  },
}

export interface InstancesSelect {
  ready?: boolean
  instances?: [GraphPointer, string][]
  selectedInstance?: [GraphPointer, string]
  loading?: boolean
}

export interface InstancesSelectEditor extends SingleEditorComponent<InstancesSelect, any> {
  loadInstance(params: {
    property: PropertyShape
    value: GraphPointer
  }): Promise<GraphPointer | null>
  loadChoices(params: {
    focusNode: FocusNode
    property: PropertyShape
  }): Promise<GraphPointer[]>
  label(choice: GraphPointer, form: Pick<FormSettings, 'labelProperties' | 'languages'>): string
}

export const instancesSelect: CoreComponents<InstancesSelectEditor> = {
  editor: dash.InstancesSelectEditor,
  async init({ form, focusNode, property, value: { componentState }, updateComponentState }) {
    if (!componentState.instances && !componentState.loading) {
      updateComponentState({
        loading: true,
      })

      const pointers = await this.loadChoices({ focusNode, property: property.shape })
      const instances = pointers.map<[GraphPointer, string]>(ptr => [ptr, this.label(ptr, form)])
        .sort(([, left], [, right]) => left.localeCompare(right))

      updateComponentState({
        instances,
        ready: true,
        loading: false,
      })
    }
  },
  async loadInstance({ property, value }) {
    return property.pointer.node(value)
  },
  async loadChoices({ property }) {
    return property.pointer.any()
      .has(rdf.type, property.class?.id)
      .toArray()
  },
  label(choice, { languages, labelProperties }) {
    return choice.out(labelProperties, { language: [...languages, ''] }).values[0] || choice.value
  },
}
