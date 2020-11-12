import { GraphPointer, MultiPointer } from 'clownface'
import { Constructor } from '@tpluscode/rdfine'
import type { PropertyShape } from '@rdfine/shacl'
import { sh } from '@tpluscode/rdf-ns-builders'
import { shrink } from '@zazuko/rdf-vocabularies/shrink'
import { FocusNode } from '../../../index'
import { getPathProperty } from '../../resources/lib/property'

interface PropertyShapeEx {
  getValues(focusNode: FocusNode): MultiPointer
  displayName: string
  inPointers: GraphPointer[]
}

declare module '@rdfine/shacl' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface PropertyShape extends PropertyShapeEx {}
}

export default function Mixin<Base extends Constructor<Omit<PropertyShape, keyof PropertyShapeEx>>>(Resource: Base) {
  return class extends Resource implements PropertyShapeEx {
    getValues(focusNode: FocusNode): MultiPointer {
      return focusNode.out(getPathProperty(this)!.id)
    }

    get displayName(): string {
      return this.name || shrink(getPathProperty(this)!.id.value)
    }

    get inPointers(): GraphPointer[] {
      return this.pointer.node(this.in).toArray()
    }
  }
}

Mixin.appliesTo = sh.PropertyShape
