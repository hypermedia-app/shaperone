import type { SingleContextClownface } from 'clownface'
import type { BlankNode, NamedNode } from 'rdf-js'
import RdfResource from '@tpluscode/rdfine/RdfResource'

export type FocusNode = SingleContextClownface<BlankNode | NamedNode>
export type { Component, SingleEditorComponent, MultiEditorComponent } from './models/components'
export type { SingleEditor, MultiEditor } from './models/editors'

export async function loadMixins(): Promise<void> {
  const deps = await import('./lib/mixins')

  Object.values(deps).forEach((bundle) => {
    RdfResource.factory.addMixin(...bundle)
  })
}
