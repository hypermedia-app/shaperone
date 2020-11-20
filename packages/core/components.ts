import { PropertyShape } from '@rdfine/shacl'
import { GraphPointer } from 'clownface'
import { NamedNode } from 'rdf-js'
import { dash, rdf, rdfs } from '@tpluscode/rdf-ns-builders'
import { SingleEditorActions, SingleEditorComponent } from './models/components'

type CoreComponents<T> = Omit<T, 'render' | 'lazyRender'>

export interface EnumSelect {
  choices?: GraphPointer[]
}

export interface EnumSelectEditor extends SingleEditorComponent<EnumSelect, any> {
  labelProperties: NamedNode[]
  loadChoices(property: PropertyShape, updateComponentState: SingleEditorActions['updateComponentState']): void
  label(choice: GraphPointer): string
}

export const enumSelect: CoreComponents<EnumSelectEditor> = {
  editor: dash.EnumSelectEditor,
  labelProperties: [rdfs.label],
  async loadChoices(property, updateComponentState) {
    updateComponentState({ choices: property.pointer.node(property.in).toArray() })
  },
  label(choice) {
    return choice.out(this.labelProperties).values[0] || choice.value
  },
}

interface InstancesSelect {
  choices: GraphPointer[]
}

export interface InstancesSelectEditor extends SingleEditorComponent<InstancesSelect, any> {
  labelProperties: NamedNode[]
  choices(property: PropertyShape): GraphPointer[]
  label(choice: GraphPointer): string
}

export const instancesSelect: CoreComponents<InstancesSelectEditor> = {
  editor: dash.InstancesSelectEditor,
  labelProperties: [rdfs.label],
  choices(property) {
    return property.pointer.any()
      .has(rdf.type, property.class?.id)
      .toArray()
  },
  label(choice) {
    return choice.out(this.labelProperties).values[0] || choice.value
  },
}
