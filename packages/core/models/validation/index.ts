import { createModel } from '@captaincodeman/rdx'
import { GraphPointer } from 'clownface'
import { DatasetCore } from 'rdf-js'

export interface Validator {
  (shapes: DatasetCore, data: DatasetCore): Promise<GraphPointer>
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
