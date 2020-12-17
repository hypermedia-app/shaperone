import { PropertyShape } from '@rdfine/shacl'
import { GraphPointer } from 'clownface'
import { NamedNode } from 'rdf-js'
import { dash, rdf, rdfs } from '@tpluscode/rdf-ns-builders'
import { SingleEditorComponent, UpdateComponentState } from './models/components'
import { FocusNode } from './index'

type CoreComponents<T> = Omit<T, 'render' | 'lazyRender'>

export interface EnumSelect {
  choices?: GraphPointer[]
}

export interface EnumSelectEditor extends SingleEditorComponent<EnumSelect, any> {
  labelProperties: NamedNode[]
  language: string[] | undefined
  loadChoices(params: {
    focusNode: FocusNode
    property: PropertyShape
    updateComponentState: UpdateComponentState<{ choices: GraphPointer[] }>
  }): void
  label(choice: GraphPointer): string
}

export const enumSelect: CoreComponents<EnumSelectEditor> = {
  editor: dash.EnumSelectEditor,
  language: undefined,
  labelProperties: [rdfs.label],
  async loadChoices({ property, updateComponentState }) {
    updateComponentState({ choices: property.pointer.node(property.in).toArray() })
  },
  label(choice) {
    return choice.out(this.labelProperties, { language: this.language }).values[0] || choice.value
  },
}

export interface InstancesSelect {
  instances?: GraphPointer[]
}

export interface InstancesSelectEditor extends SingleEditorComponent<InstancesSelect, any> {
  labelProperties: NamedNode[]
  language: string[] | undefined
  loadChoices(params: {
    focusNode: FocusNode
    property: PropertyShape
    updateComponentState: UpdateComponentState<{ instances: GraphPointer[] }>
  }): void
  label(choice: GraphPointer): string
}

export const instancesSelect: CoreComponents<InstancesSelectEditor> = {
  editor: dash.InstancesSelectEditor,
  language: undefined,
  labelProperties: [rdfs.label],
  async loadChoices({ property, updateComponentState }) {
    updateComponentState({
      instances: property.pointer.any()
        .has(rdf.type, property.class?.id)
        .toArray(),
    })
  },
  label(choice) {
    return choice.out(this.labelProperties, { language: this.language }).values[0] || choice.value
  },
}
