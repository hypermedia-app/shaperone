import { describe, it } from 'mocha'
import { expect } from 'chai'
import { connect, disconnect } from '../../../../models/forms/reducers/connection'

describe('core/models/forms/reducers/connection', () => {
  describe('connect', () => {
    it('creates a state for given form', () => {
      // given
      const before = {
        instances: new Map(),
        singleEditors: [],
        multiEditors: [],
      }
      const form = Symbol('test')

      // when
      const after = connect(before, form)

      // then
      expect(after.instances.has(form))
      expect(after.instances.get(form)).to.be.a('Object')
    })
  })

  describe('disconnect', () => {
    it('removes own state', () => {
      // given
      const form = Symbol('test')
      const before = {
        instances: new Map(),
        singleEditors: [],
        multiEditors: [],
      }
      before.instances.set(form, {})

      // when
      const after = disconnect(before, form)

      // then
      expect(after.instances.size).to.eq(0)
    })
  })
})
