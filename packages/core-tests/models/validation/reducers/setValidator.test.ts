import { describe, it } from 'mocha'
import { expect } from 'chai'
import { ValidatorState } from '@hydrofoil/shaperone-core/models/validation'
import { setValidator } from '@hydrofoil/shaperone-core/models/validation/reducers/setValidator'

describe('@hydrofoil/shaperone-core/models/validation/reducers/setValidator', () => {
  it('gets replaced in state', () => {
    // given
    const before: ValidatorState = {
      validator: async () => ({} as any),
    }

    // when
    const newValidator = async () => ({} as any)
    const after = setValidator(before, newValidator)

    // then
    expect(after.validator).to.eq(newValidator)
  })
})
