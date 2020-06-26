import { describe, it } from 'mocha'
import { connect, disconnect } from '../../../../models/forms/reducers/connection'
import { expect } from 'chai'

describe('core/models/forms/reducers/connection', () => {
  describe('connect', () => {
    it('creates a state for given form', function () {
      // given
      const before = {
        instances: new Map(),
        valueEditors: [],
      }
      const form = {}

      // when
      const after = connect(before, form)

      // then
      expect(after.instances.has(form))
      expect(after.instances.get(form)).to.matchSnapshot(this)
    })
  })

  describe('disconnect', () => {
    it('removes own state', () => {
      // given
      const form = {}
      const before = {
        instances: new Map(),
        valueEditors: [],
      }
      before.instances.set(form, {})

      // when
      const after = disconnect(before, form)

      // then
      expect(after.instances.size).to.eq(0)
    })
  })
})
