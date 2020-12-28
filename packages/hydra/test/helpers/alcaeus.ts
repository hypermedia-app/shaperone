import RdfResourceImpl, { ResourceIdentifier } from '@tpluscode/rdfine'
import { GraphPointer } from 'clownface'
import type * as Alcaeus from 'alcaeus/ResourceRepresentation'
import type { RdfResourceCore } from '@tpluscode/rdfine/RdfResource'
import { Resource } from '@rdfine/hydra'
import { NamedNode } from 'rdf-js'
import { rdf } from '@tpluscode/rdf-ns-builders'

export class ResourceRepresentation implements Alcaeus.ResourceRepresentation<any, any> {
  constructor(private resources: GraphPointer<ResourceIdentifier>[]) {
  }

  get length() {
    return this.resources.length
  }

  get root() {
    return RdfResourceImpl.factory.createEntity(this.resources[0])
  }

  get<T = RdfResourceCore>(uri: string): (T & Resource<any>) | undefined {
    return this.resources
      .filter(ptr => ptr.value === uri)
      .map(ptr => RdfResourceImpl.factory.createEntity<T & Resource<any>>(ptr))[0]
  }

  ofType<T = RdfResourceCore>(classId: string | NamedNode): (T & Resource<any>)[] {
    return this.resources
      .filter(r => r.has(rdf.type, classId).terms.length)
      .map(ptr => RdfResourceImpl.factory.createEntity<T & Resource<any>>(ptr))
  }

  [Symbol.iterator](): Iterator<Resource<any>> {
    return this.resources.map(ptr => RdfResourceImpl.factory.createEntity<Resource<any>>(ptr))[Symbol.iterator]()
  }
}
