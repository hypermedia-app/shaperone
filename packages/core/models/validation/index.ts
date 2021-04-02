/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-core/models/validation
 */

import { createModel } from '@captaincodeman/rdx'
import { DatasetCore, Term } from 'rdf-js'
import { setValidator } from './reducers/setValidator'

/**
 * Interface for validation functions
 *
 * @returns lazily, graph pointer to the `sh:ValidationReport` instance
 */
export interface Validator {
  (shapes: DatasetCore, data: DatasetCore): Promise<{ term: Term; dataset: DatasetCore }>
}

export interface ValidatorState {
  validator?: Validator
}

export type State = Map<symbol, ValidatorState>

export const validation = createModel({
  state: <ValidatorState>{},
  reducers: {
    setValidator,
  },
})
