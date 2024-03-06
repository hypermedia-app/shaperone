import { addPlugin } from '@hydrofoil/shaperone-core/store'
import { expect } from '@open-wc/testing'
import { store } from '../store.js'

describe('wc/store', () => {
  context('with plugins', () => {
    before(() => {
      addPlugin({
        foo: {
          model: {
            state: {},
            reducers: {},
          },
        },
      })
      addPlugin({
        bar: {
          model: {
            state: {},
            reducers: {},
          },
        },
      })
    })

    after(() => {
      addPlugin({
        foo: undefined,
        bar: undefined,
      })
    })

    it('creates store with plugins', () => {
      // when
      const s = store()

      // then
      expect(s.state).to.have.property('foo')
      expect(s.state).to.have.property('bar')
    })

    it('returns same instance', () => {
      expect(store()).to.eq(store())
    })
  })
})
