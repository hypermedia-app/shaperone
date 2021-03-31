import clownface, { GraphPointer } from 'clownface'
import { DatasetCore } from 'rdf-js'
import type { Options } from 'rdf-validate-shacl'
import type { Validator } from '@hydrofoil/shaperone-core/models/validation'

interface Validate extends Validator {
  with(factory: Options['factory']): Validator
}

function create(options?: Options) {
  return async function (shapesGraph: DatasetCore, dataGraph: DatasetCore): Promise<GraphPointer> {
    const Validator = (await import('rdf-validate-shacl')).default

    const validator = new Validator(shapesGraph, options)
    const report = validator.validate(dataGraph)

    return clownface(report)
  }
}

export const validate: Validate = create() as any
validate.with = (factory: Options['factory']) => create({ factory })
