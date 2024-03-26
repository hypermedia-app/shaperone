/**
 * @packageDocumentation
 * @module @hydrofoil/shaperone-core/models/validation
 */

import { createModel } from '@captaincodeman/rdx'
import type { DatasetCore, Term } from '@rdfjs/types'
import { setValidator } from './reducers/setValidator.js'

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
