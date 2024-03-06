import type { Environment } from '@rdfjs/environment/Environment'
import type { DataFactory, Literal } from '@rdfjs/types'
import type { NsBuildersFactory } from '@tpluscode/rdf-ns-builders/Factory.js'

export default class ConstantsFactory {
  constant!: {
    TRUE: Literal
    FALSE: Literal
  }

  init(this: Environment<DataFactory | NsBuildersFactory | ConstantsFactory>) {
    this.constant = {
      TRUE: this.literal('true', this.ns.xsd.boolean),
      FALSE: this.literal('false', this.ns.xsd.boolean),
    }
  }
}
