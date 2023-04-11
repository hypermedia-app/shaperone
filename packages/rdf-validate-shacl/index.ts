import { DataFactory, DatasetCore, DatasetCoreFactory, Term } from 'rdf-js'
import type { Environment } from '@rdfjs/environment/Environment'
import type * as RdfValidateShacl from 'rdf-validate-shacl'
import type { Validator } from '@hydrofoil/shaperone-core/models/validation'

type Options = RdfValidateShacl.Options<Environment<DatasetCoreFactory | DataFactory>>

interface Validate extends Validator {
  with(factory: Options): Validator
}

function create(options?: Options) {
  return async function (shapesGraph: DatasetCore, dataGraph: DatasetCore): Promise<{ term: Term; dataset: DatasetCore }> {
    const Validator = (await import('rdf-validate-shacl')).default

    const validator = new Validator(shapesGraph, options)
    return validator.validate(dataGraph)
  }
}

export const validate: Validate = create() as any
validate.with = (options: Options) => create(options)
