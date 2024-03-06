import { describe, it } from 'mocha'
import { expect } from 'chai'
import { connect, disconnect } from '@hydrofoil/shaperone-core/models/forms/reducers/connection.js'
import FormMap from '@hydrofoil/shaperone-core/models/StateMap.js'
import { State } from '@hydrofoil/shaperone-core/models/forms/index.js'

describe('core/models/forms/reducers/connection', () => {
  describe('connect', () => {
    it('creates a state for given form', () => {
      // given
      const before: State = new FormMap()
      const form = Symbol('test')

      // when
      const after = connect(before, { form })

      // then
      expect(after.has(form))
      expect(after.get(form)).to.be.a('Object')
    })
  })

  describe('disconnect', () => {
    it('removes own state', () => {
      // given
      const form = Symbol('test')
      const before: State = new FormMap()
      before.set(form, <any>{})

      // when
      const after = disconnect(before, form)

      // then
      expect(after.size).to.eq(0)
    })
  })
})
