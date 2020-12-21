import { ResourceIdentifier } from '@tpluscode/rdfine'
import { GraphPointer } from 'clownface'

export class ResourceRepresentation {
  constructor(private pointer: GraphPointer<ResourceIdentifier>) {
  }
}
