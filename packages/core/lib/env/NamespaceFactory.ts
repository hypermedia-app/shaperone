import type { NamespaceBuilder } from '@rdfjs/namespace'
import type { NamespaceFactory } from '@rdfjs/namespace/Factory'
import type { Environment } from '@rdfjs/environment/Environment'
import type { NsBuildersFactory } from '@tpluscode/rdf-ns-builders/Factory.js'

declare module '@tpluscode/rdf-ns-builders' {
  interface CustomNamespaces {
    sh1: NamespaceBuilder
  }
}

export default class {
  init(this: Environment<NamespaceFactory | NsBuildersFactory>) {
    this.ns = {
      ...this.ns,
      sh1: this.namespace('https://hypermedia.app/shaperone#'),
    }
  }
}
