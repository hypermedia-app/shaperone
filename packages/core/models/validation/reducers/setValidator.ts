import type { Validator, ValidatorState } from '..'

export function setValidator(state: ValidatorState, validator: Validator) {
  return {
    ...state,
    validator,
  }
}
