import { PropertyShape } from '@rdfine/shacl'
import { GraphPointer } from 'clownface'
import { dash, rdf } from '@tpluscode/rdf-ns-builders'
import { SingleEditorComponent, UpdateComponentState } from './models/components'
import { FocusNode } from './index'
import { FormSettings } from './models/forms'

type CoreComponents<T> = Omit<T, 'render' | 'lazyRender'>

export interface EnumSelect {
  choices?: GraphPointer[]
  loading?: boolean
}

export interface EnumSelectEditor extends SingleEditorComponent<EnumSelect, any> {
  loadChoices(params: {
    focusNode: FocusNode
    property: PropertyShape
    componentState: EnumSelect
    updateComponentState: UpdateComponentState<EnumSelect>
  }): void
  label(choice: GraphPointer, form: Pick<FormSettings, 'labelProperties' | 'languages'>): string
}

export const enumSelect: CoreComponents<EnumSelectEditor> = {
  editor: dash.EnumSelectEditor,
  async loadChoices({ property, updateComponentState }) {
    updateComponentState({ choices: property.pointer.node(property.in).toArray() })
  },
  label(choice, { languages, labelProperties }) {
    return choice.out(labelProperties, { language: [...languages, ''] }).values[0] || choice.value
  },
}

export interface InstancesSelect {
  instances?: GraphPointer[]
  loading?: boolean
}

export interface InstancesSelectEditor extends SingleEditorComponent<InstancesSelect, any> {
  loadChoices(params: {
    focusNode: FocusNode
    property: PropertyShape
    componentState: InstancesSelect
    updateComponentState: UpdateComponentState<InstancesSelect>
  }): void
  label(choice: GraphPointer, form: Pick<FormSettings, 'labelProperties' | 'languages'>): string
}

export const instancesSelect: CoreComponents<InstancesSelectEditor> = {
  editor: dash.InstancesSelectEditor,
  async loadChoices({ property, updateComponentState }) {
    updateComponentState({
      instances: property.pointer.any()
        .has(rdf.type, property.class?.id)
        .toArray(),
    })
  },
  label(choice, { languages, labelProperties }) {
    return choice.out(labelProperties, { language: [...languages, ''] }).values[0] || choice.value
  },
}
