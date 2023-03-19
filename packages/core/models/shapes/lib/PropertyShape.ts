import { GraphPointer, MultiPointer } from 'clownface'
import { Constructor } from '@tpluscode/rdfine'
import type { PropertyShape } from '@rdfine/shacl'
import { sh } from '@tpluscode/rdf-ns-builders'
import { shrink } from '@zazuko/prefixes'
import { NamedNode, Term } from 'rdf-js'
import TermSet from '@rdfjs/term-set'
import type { RdfResourceCore } from '@tpluscode/rdfine/RdfResource'
import type { Resource } from '@rdfine/rdfs'
import { findNodes } from 'clownface-shacl-path'
import { FocusNode } from '../../../index.js'

interface PropertyShapeEx {
  getPathProperty<T extends boolean = false>(throwIfNotPredicatePath?: T): T extends true ? Resource : (Resource | undefined)
  pathEquals(other: NamedNode | GraphPointer | undefined): boolean
  getValues(focusNode: FocusNode): MultiPointer

  /**
   * @deprecated
   */
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

    private get __predicatePath() {
      const { path } = this

      if (!path || Array.isArray(path)) {
        return undefined
      }

      return path
    }

    permitsDatatype(dt: NamedNode): boolean {
      return this.datatype?.equals(dt) || this.oredTypes.has(dt)
    }

    getPathProperty<T extends boolean = false>(throwIfNotPredicatePath?: T): any {
      const { __predicatePath } = this

      if (!__predicatePath && throwIfNotPredicatePath) {
        throw new Error(`Property Shape ${this.id.value} is not a predicate path`)
      }

      return __predicatePath
    }

    pathEquals(other: NamedNode | GraphPointer | undefined): boolean {
      return !this.__predicatePath ? false : this.__predicatePath.equals(other)
    }

    getValues(focusNode: FocusNode): MultiPointer {
      return findNodes(focusNode, this.pointer.out(sh.path))
    }

    get displayName(): string {
      const [name] = this.pointer.out(sh.name).values

      if (!name) {
        const { path } = this
        if (Array.isArray(path)) {
          return 'Complex path'
        }

        return shrink(path!.id.value)
      }

      return name
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
