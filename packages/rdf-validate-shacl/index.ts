import type * as RDF from '@rdfjs/types'
import type { Options } from 'rdf-validate-shacl'
import type { Validator } from '@hydrofoil/shaperone-core/models/validation'

interface Validate extends Validator {
  /**
   * @deprecated It is recommended to use the default factory managed by Shaperone
   */
  with<T extends RDF.DataFactory & RDF.DatasetCoreFactory>(factory: Options<T>): Validator
}

function create<T extends RDF.DataFactory & RDF.DatasetCoreFactory>(options?: Options<T>) {
  return async function (shapesGraph: RDF.DatasetCore, dataGraph: RDF.DatasetCore): Promise<{ term: RDF.Term; dataset: RDF.DatasetCore }> {
    const Validator = (await import('rdf-validate-shacl')).default

    const validator = new Validator(shapesGraph, options)
    return validator.validate(dataGraph)
  }
}

export const validate: Validate = create() as any
validate.with = <T extends RDF.DataFactory & RDF.DatasetCoreFactory>(options: Options<T>) => create(options)
