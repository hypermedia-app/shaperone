import { describe, it } from 'mocha'
import { expect } from 'chai'
import { dash } from '@tpluscode/rdf-ns-builders'
import reducers from '../../../models/components/reducers'

describe('core/models/components/reducers', () => {
  describe('pushComponents', () => {
    it('can be called with object', () => {
      // given
      const before = {}
      const component = {
        editor: dash.FooEditor,
        render() {
          return null
        },
      }

      // when
      const after = reducers.pushComponents(before, {
        component,
      })

      // then
      expect(after[dash.FooEditor.value].render).to.eq(component.render)
    })

    it('can be called with array', () => {
    // given
      const before = {}
      const component = {
        editor: dash.FooEditor,
        render() {
          return null
        },
      }

      // when
      const after = reducers.pushComponents(before, [component])

      // then
      expect(after[dash.FooEditor.value].render).to.eq(component.render)
    })
  })
})
