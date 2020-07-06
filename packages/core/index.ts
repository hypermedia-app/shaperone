import type { SingleContextClownface } from 'clownface'
import type { BlankNode, NamedNode } from 'rdf-js'
import RdfResource from '@tpluscode/rdfine/RdfResource'

export type FocusNode = SingleContextClownface<BlankNode | NamedNode>
export type { Component } from './models/components'

export async function loadMixins(): Promise<void> {
  const deps = await import('./lib/mixins')

  Object.values(deps).forEach((bundle) => {
    RdfResource.factory.addMixin(...bundle)
  })
}
