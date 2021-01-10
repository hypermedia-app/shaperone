/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-core
 */

import type { BlankNode, NamedNode } from 'rdf-js'
import RdfResource from '@tpluscode/rdfine/RdfResource'
import { GraphPointer } from 'clownface'
import '@rdfine/dash/extensions/sh/PropertyShape'

/**
 * A [focus node](https://www.w3.org/TR/shacl/#focusNodes) is a graph pointer to a Named Node or a Blank Node
 */
export type FocusNode = GraphPointer<BlankNode | NamedNode>
export type { Component, SingleEditorComponent, MultiEditorComponent, RenderComponent, Lazy } from './models/components'
export type { SingleEditor, MultiEditor } from './models/editors'

/**
 * @ignore
 */
export async function loadMixins(): Promise<void> {
  const deps = await import('./lib/mixins')

  Object.values(deps).forEach((bundle) => {
    RdfResource.factory.addMixin(...bundle)
  })
}
