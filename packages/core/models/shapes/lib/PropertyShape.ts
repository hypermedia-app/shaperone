import { MultiPointer } from 'clownface'
import { Constructor } from '@tpluscode/rdfine'
import type { PropertyShape } from '@rdfine/shacl'
import { sh } from '@tpluscode/rdf-ns-builders'
import { shrink } from '@zazuko/rdf-vocabularies/shrink'
import { NamedNode, Term } from 'rdf-js'
import TermSet from '@rdf-esm/term-set'
import type { RdfResourceCore } from '@tpluscode/rdfine/RdfResource'
import { FocusNode } from '../../../index'
import { getPathProperty } from '../../resources/lib/property'

interface PropertyShapeEx {
  getValues(focusNode: FocusNode): MultiPointer
  displayName: string
  permitsDatatype(datatype: NamedNode): boolean
}

declare module '@rdfine/shacl' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface PropertyShape extends PropertyShapeEx {}
}

export default function Mixin<Base extends Constructor<Omit<PropertyShape, keyof PropertyShapeEx>>>(Resource: Base): Constructor<PropertyShapeEx & RdfResourceCore> & Base {
  return class extends Resource implements PropertyShapeEx {
    private __orderTypes: Set<Term> | undefined

    permitsDatatype(dt: NamedNode): boolean {
      return this.datatype?.equals(dt) || this.oredTypes.has(dt)
    }

    getValues(focusNode: FocusNode): MultiPointer {
      return focusNode.out(getPathProperty(this)!.id)
    }

    get displayName(): string {
      return this.name || shrink(getPathProperty(this)!.id.value)
    }

    get oredTypes(): Set<Term> {
      if (!this.__orderTypes) {
        this.__orderTypes = this.or.reduce((types, shape) => {
          const dt = shape.pointer.out(sh.datatype).term
          return dt ? types.add(dt) : types
        }, new TermSet())
      }

      return this.__orderTypes
    }
  }
}

Mixin.appliesTo = sh.PropertyShape
