import { ResourceIdentifier } from '@tpluscode/rdfine'
import type { GraphPointer } from 'clownface'
import type { ResourceRepresentation } from 'alcaeus-core'
import type { RdfResourceCore } from '@tpluscode/rdfine/RdfResource'
import { Resource } from '@rdfine/hydra'
import type { NamedNode } from '@rdfjs/types'
import { rdf } from '@tpluscode/rdf-ns-builders'
import $rdf from '@shaperone/testing/env.js'

export default class implements ResourceRepresentation<any, any> {
  // eslint-disable-next-line no-empty-function
  constructor(private resources: GraphPointer<ResourceIdentifier>[]) {
  }

  get length() {
    return this.resources.length
  }

  get root() {
    return $rdf.rdfine().factory.createEntity(this.resources[0])
  }

  get<T = RdfResourceCore>(uri: string): (T & Resource<any>) | undefined {
    return this.resources
      .filter(ptr => ptr.value === uri)
      .map(ptr => $rdf.rdfine().factory.createEntity<T & Resource<any>>(ptr))[0]
  }

  ofType<T = RdfResourceCore>(classId: string | NamedNode): (T & Resource<any>)[] {
    return this.resources
      .filter(r => r.has(rdf.type, classId).terms.length)
      .map(ptr => $rdf.rdfine().factory.createEntity<T & Resource<any>>(ptr))
  }

  [Symbol.iterator](): Iterator<Resource<any>> {
    return this.resources.map(ptr => $rdf.rdfine().factory.createEntity<Resource<any>>(ptr))[Symbol.iterator]()
  }
}
