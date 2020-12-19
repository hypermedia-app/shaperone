import { describe, it } from 'mocha'
import { expect } from 'chai'
import { connect, disconnect } from '../../../../models/forms/reducers/connection'

describe('core/models/forms/reducers/connection', () => {
  describe('connect', () => {
    it('creates a state for given form', () => {
      // given
      const before = new Map()
      const form = Symbol('test')

      // when
      const after = connect(before, { form })

      // then
      expect(after.has(form))
      expect(after.get(form)).to.be.a('Object')
    })

    it('initializes languages', () => {
      // given
      const before = new Map()
      const form = Symbol('test')

      // when
      const after = connect(before, { form, languages: ['en'] })

      // then
      expect(after.has(form))
      expect(after.get(form)?.languages).to.contain('en')
    })
  })

  describe('disconnect', () => {
    it('removes own state', () => {
      // given
      const form = Symbol('test')
      const before = new Map()
      before.set(form, {})

      // when
      const after = disconnect(before, form)

      // then
      expect(after.size).to.eq(0)
    })
  })
})
