import { describe, it } from 'mocha'
import { expect } from 'chai'
import { connect, disconnect } from '../../../../models/forms/reducers/connection'

describe('core/models/forms/reducers/connection', () => {
  describe('connect', () => {
    it('creates a state for given form', function () {
      // given
      const before = {
        instances: new Map(),
        singleEditors: [],
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
        singleEditors: [],
      }
      before.instances.set(form, {})

      // when
      const after = disconnect(before, form)

      // then
      expect(after.instances.size).to.eq(0)
    })
  })
})
