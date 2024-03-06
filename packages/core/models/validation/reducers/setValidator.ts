import type { Validator, ValidatorState } from '../index.js'

export function setValidator(state: ValidatorState, validator: Validator) {
  return {
    ...state,
    validator,
  }
}
