import { describe, it } from 'mocha'
import { expect } from 'chai'
import type { ValidatorState } from '@shaperone/core/models/validation/index.js'
import { setValidator } from '@shaperone/core/models/validation/reducers/setValidator.js'

describe('@shaperone/core/models/validation/reducers/setValidator', () => {
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
