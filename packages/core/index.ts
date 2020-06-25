import type { SingleContextClownface } from 'clownface'
import type { BlankNode, NamedNode } from 'rdf-js'
import { Mixin } from '@tpluscode/rdfine/lib/ResourceFactory'
import RdfResource from '@tpluscode/rdfine/RdfResource'

export type FocusNode = SingleContextClownface<BlankNode | NamedNode>
export type { Component } from './models/components'

export async function loadMixins(): Promise<void> {
  const deps = [
    import('@rdfine/shacl/dependencies/Shape.js').then(s => s.ShapeDependencies),
    import('@rdfine/shacl/dependencies/PropertyShape.js').then(s => s.PropertyShapeDependencies),
    import('@rdfine/shacl/dependencies/PropertyGroup.js').then(s => s.PropertyGroupDependencies),
  ]

  const mixins = (await Promise.all(deps)).reduce<Mixin[]>((flat, mixins) => {
    return [
      ...flat,
      ...Object.values(mixins),
    ]
  }, [])

  RdfResource.factory.addMixin(...mixins)
}
