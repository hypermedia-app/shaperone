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

    it('replaces an editor if it is has a different render function', () => {
      // given
      const before = {
        [dash.FooEditor.value]: {
          editor: dash.FooEditor,
          render() {
            return null
          },
          loading: false,
        },
      }
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

    it('replaces an editor if it is has a different lazyRender function', () => {
      // given
      const before = {
        [dash.FooEditor.value]: {
          editor: dash.FooEditor,
          async lazyRender() {
            return () => null
          },
          loading: false,
        },
      }
      const component = {
        editor: dash.FooEditor,
        async lazyRender() {
          return () => null
        },
      }

      // when
      const after = reducers.pushComponents(before, [component])

      // then
      expect(after[dash.FooEditor.value].lazyRender).to.eq(component.lazyRender)
    })

    it('replaces an editor if new is lazy', () => {
      // given
      const before = {
        [dash.FooEditor.value]: {
          editor: dash.FooEditor,
          render() {
            return null
          },
          loading: false,
        },
      }
      const component = {
        editor: dash.FooEditor,
        async lazyRender() {
          return () => null
        },
      }

      // when
      const after = reducers.pushComponents(before, [component])

      // then
      expect(after[dash.FooEditor.value].lazyRender).to.eq(component.lazyRender)
    })

    it('replaces an editor if new is no lazy', () => {
      // given
      const before = {
        [dash.FooEditor.value]: {
          editor: dash.FooEditor,
          async lazyRender() {
            return () => null
          },
          loading: false,
        },
      }
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
