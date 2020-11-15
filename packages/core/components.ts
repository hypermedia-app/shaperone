import { PropertyShape } from '@rdfine/shacl'
import { GraphPointer } from 'clownface'
import { NamedNode } from 'rdf-js'
import { dash, rdf, rdfs } from '@tpluscode/rdf-ns-builders'
import { SingleEditorComponent } from './models/components'

type CoreComponents<T> = Omit<T, 'render' | 'lazyRender'>

export interface EnumSelectEditor extends SingleEditorComponent<any> {
  labelProperties: NamedNode[]
  choices(property: PropertyShape): GraphPointer[]
  label(choice: GraphPointer): string
}

export const enumSelect: CoreComponents<EnumSelectEditor> = {
  editor: dash.EnumSelectEditor,
  labelProperties: [rdfs.label],
  choices(property) {
    return property.pointer.node(property.in).toArray()
  },
  label(choice) {
    return choice.out(this.labelProperties).values[0] || choice.value
  },
}

export interface InstancesSelectEditor extends SingleEditorComponent<any> {
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
