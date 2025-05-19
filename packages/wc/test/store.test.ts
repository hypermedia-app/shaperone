import { addPlugin } from '@hydrofoil/shaperone-core/store.js'
import { expect } from '@open-wc/testing'
import { store } from '../store.js'

describe('wc/store', function () {
  context('with plugins', function () {
    before(function () {
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

    after(function () {
      addPlugin({
        foo: undefined,
        bar: undefined,
      })
    })

    it('creates store with plugins', function () {
      // when
      const s = store()

      // then
      expect(s.state).to.have.property('foo')
      expect(s.state).to.have.property('bar')
    })
  })
})
