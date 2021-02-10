import { MultiPointer } from 'clownface'
import { Constructor } from '@tpluscode/rdfine'
import type { PropertyShape } from '@rdfine/shacl'
import { sh } from '@tpluscode/rdf-ns-builders'
import { NamedNode, Term } from 'rdf-js'
import TermSet from '@rdf-esm/term-set'
import type { RdfResourceCore } from '@tpluscode/rdfine/RdfResource'
import type { Resource } from '@rdfine/rdfs'
import { FocusNode } from '../../../index'

interface PropertyShapeEx {
  getPathProperty(): Resource | undefined
  getValues(focusNode: FocusNode): MultiPointer
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

    getPathProperty(): Resource | undefined {
      return (Array.isArray(this.path) ? this.path[0] : this.path)
    }

    getValues(focusNode: FocusNode): MultiPointer {
      return focusNode.out(this.getPathProperty()!.id)
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
