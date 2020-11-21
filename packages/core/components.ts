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
  loadChoices(params: {
    focusNode: FocusNode
    property: PropertyShape
    updateComponentState: UpdateComponentState
  }): void
  label(choice: GraphPointer): string
}

export const enumSelect: CoreComponents<EnumSelectEditor> = {
  editor: dash.EnumSelectEditor,
  labelProperties: [rdfs.label],
  async loadChoices({ property, updateComponentState }) {
    updateComponentState({ choices: property.pointer.node(property.in).toArray() })
  },
  label(choice) {
    return choice.out(this.labelProperties).values[0] || choice.value
  },
}

export interface InstancesSelect {
  instances?: GraphPointer[]
}

export interface InstancesSelectEditor extends SingleEditorComponent<InstancesSelect, any> {
  labelProperties: NamedNode[]
  loadChoices(params: {
    focusNode: FocusNode
    property: PropertyShape
    updateComponentState: UpdateComponentState
  }): void
  label(choice: GraphPointer): string
}

export const instancesSelect: CoreComponents<InstancesSelectEditor> = {
  editor: dash.InstancesSelectEditor,
  labelProperties: [rdfs.label],
  async loadChoices({ property, updateComponentState }) {
    updateComponentState({
      instances: property.pointer.any()
        .has(rdf.type, property.class?.id)
        .toArray(),
    })
  },
  label(choice) {
    return choice.out(this.labelProperties).values[0] || choice.value
  },
}
