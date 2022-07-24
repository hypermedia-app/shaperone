import { describe, it } from 'mocha'
import { expect } from 'chai'
import { dash } from '@tpluscode/rdf-ns-builders/loose'
import reducers from '@hydrofoil/shaperone-core/models/components/reducers.js'
import { Component, ComponentDecorator, ComponentsState } from '@hydrofoil/shaperone-core/models/components'

describe('core/models/components/reducers', () => {
  describe('pushComponents', () => {
    it('can be called with object', () => {
      // given
      const before = { components: {}, decorators: [] }
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
      expect(after.components[dash.FooEditor.value].render).to.eq(component.render)
    })

    it('can be called with array', () => {
      // given
      const before = { components: {}, decorators: [] }
      const component = {
        editor: dash.FooEditor,
        render() {
          return null
        },
      }

      // when
      const after = reducers.pushComponents(before, [component])

      // then
      expect(after.components[dash.FooEditor.value].render).to.eq(component.render)
    })

    it('replaces an editor if it is has a different render function', () => {
      // given
      const before = {
        components: {
          [dash.FooEditor.value]: {
            editor: dash.FooEditor,
            render() {
              return null
            },
            loading: false,
          },
        },
        decorators: [],
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
      expect(after.components[dash.FooEditor.value].render).to.eq(component.render)
    })

    it('replaces an editor if it is has a different lazyRender function', () => {
      // given
      const before = {
        components: {
          [dash.FooEditor.value]: {
            editor: dash.FooEditor,
            async lazyRender() {
              return () => null
            },
            loading: false,
          },
        },
        decorators: [],
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
      expect(after.components[dash.FooEditor.value].lazyRender).to.eq(component.lazyRender)
    })

    it('replaces an editor if new is lazy', () => {
      // given
      const before = {
        components: {
          [dash.FooEditor.value]: {
            editor: dash.FooEditor,
            render() {
              return null
            },
            loading: false,
          },
        },
        decorators: [],
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
      expect(after.components[dash.FooEditor.value].lazyRender).to.eq(component.lazyRender)
    })

    it('replaces an editor if new is no lazy', () => {
      // given
      const before = {
        components: {
          [dash.FooEditor.value]: {
            editor: dash.FooEditor,
            async lazyRender() {
              return () => null
            },
            loading: false,
          },
        },
        decorators: [],
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
      expect(after.components[dash.FooEditor.value].render).to.eq(component.render)
    })

    it('applies decorators', () => {
      // given
      const before: ComponentsState = {
        components: {},
        decorators: [{
          applicableTo: () => true,
          decorate(component) {
            return {
              ...component,
              decorated: 'foobar',
            }
          },
        }],
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
      expect(after.components[dash.FooEditor.value]).to.have.property('decorated', 'foobar')
    })
  })

  describe('decorate', () => {
    it('combine all applicable decorators', () => {
      // given
      type FooComponent = Component & { foo: string }
      const addFoo: ComponentDecorator<FooComponent> = {
        applicableTo: () => true,
        decorate(component) {
          return {
            ...component,
            foo: `${component.foo}foo`,
          }
        },
      }
      const addBar: ComponentDecorator<FooComponent> = {
        applicableTo: () => true,
        decorate(component) {
          return {
            ...component,
            foo: `${component.foo}bar`,
          }
        },
      }
      const component = {
        editor: dash.FooEditor,
        foo: '',
        loading: false,
      }
      const before = {
        components: {
          [dash.FooEditor.value]: component,
        },
        decorators: [addFoo],
      }

      // when
      const result = reducers.decorate(before, addBar)

      // then
      expect(result.components[dash.FooEditor.value]).to.have.property('foo', 'foobar')
    })

    it('does not apply non applicable decorator', () => {
      // given
      type FooComponent = Component & { foo: string }
      const nope: ComponentDecorator<FooComponent> = {
        applicableTo: () => false,
        decorate: component => component,
      }
      const component = {
        editor: dash.FooEditor,
        foo: '',
        loading: false,
      }
      const before = {
        components: {
          [dash.FooEditor.value]: component,
        },
        decorators: [],
      }

      // when
      const result = reducers.decorate(before, nope)

      // then
      expect(result.components[dash.FooEditor.value]).to.eq(component)
    })
  })
})
