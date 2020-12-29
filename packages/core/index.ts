import type { BlankNode, NamedNode } from 'rdf-js'
import RdfResource from '@tpluscode/rdfine/RdfResource'
import { GraphPointer } from 'clownface'
import '@rdfine/dash/extensions/sh/PropertyShape'

export type FocusNode = GraphPointer<BlankNode | NamedNode>
export type { Component, SingleEditorComponent, MultiEditorComponent, RenderSingleEditor, RenderMultiEditor, Lazy } from './models/components'
export type { SingleEditor, MultiEditor } from './models/editors'

export async function loadMixins(): Promise<void> {
  const deps = await import('./lib/mixins')

  Object.values(deps).forEach((bundle) => {
    RdfResource.factory.addMixin(...bundle)
  })
}
