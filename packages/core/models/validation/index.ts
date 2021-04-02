/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-core/models/validation
 */

import { createModel } from '@captaincodeman/rdx'
import { DatasetCore, Term } from 'rdf-js'

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
    setValidator(state, validator: Validator) {
      return {
        ...state,
        validator,
      }
    },
  },
})
