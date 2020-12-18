import { PropertyShape } from '@rdfine/shacl'
import { GraphPointer } from 'clownface'
import { NamedNode } from 'rdf-js'
import { dash, rdf, rdfs } from '@tpluscode/rdf-ns-builders'
import { SingleEditorComponent, UpdateComponentState } from './models/components'
import { FocusNode } from './index'

type CoreComponents<T> = Omit<T, 'render' | 'lazyRender'>

export interface EnumSelect {
  choices?: GraphPointer[]
  loading?: boolean
}

export interface EnumSelectEditor extends SingleEditorComponent<EnumSelect, any> {
  labelProperties: NamedNode[]
  language: string[]
  loadChoices(params: {
    focusNode: FocusNode
    property: PropertyShape
    componentState: EnumSelect
    updateComponentState: UpdateComponentState<EnumSelect>
  }): void
  label(choice: GraphPointer): string
}

export const enumSelect: CoreComponents<EnumSelectEditor> = {
  editor: dash.EnumSelectEditor,
  language: [...navigator.languages],
  labelProperties: [rdfs.label],
  async loadChoices({ property, updateComponentState }) {
    updateComponentState({ choices: property.pointer.node(property.in).toArray() })
  },
  label(choice) {
    return choice.out(this.labelProperties, { language: [...this.language, ''] }).values[0] || choice.value
  },
}

export interface InstancesSelect {
  instances?: GraphPointer[]
  loading?: boolean
}

export interface InstancesSelectEditor extends SingleEditorComponent<InstancesSelect, any> {
  labelProperties: NamedNode[]
  language: string[]
  loadChoices(params: {
    focusNode: FocusNode
    property: PropertyShape
    componentState: InstancesSelect
    updateComponentState: UpdateComponentState<InstancesSelect>
  }): void
  label(choice: GraphPointer): string
}

export const instancesSelect: CoreComponents<InstancesSelectEditor> = {
  editor: dash.InstancesSelectEditor,
  language: [...navigator.languages],
  labelProperties: [rdfs.label],
  async loadChoices({ property, updateComponentState }) {
    updateComponentState({
      instances: property.pointer.any()
        .has(rdf.type, property.class?.id)
        .toArray(),
    })
  },
  label(choice) {
    return choice.out(this.labelProperties, { language: [...this.language, ''] }).values[0] || choice.value
  },
}
