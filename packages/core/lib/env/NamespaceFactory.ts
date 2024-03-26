import type { NamespaceBuilder } from '@rdfjs/namespace'
import type { NamespaceFactory } from '@rdfjs/namespace/Factory.js'
import type { Environment } from '@rdfjs/environment/Environment.js'
import type NsBuildersFactory from '@tpluscode/rdf-ns-builders'

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
