import {
  ComponentDecorator,
  SingleEditorActions,
  SingleEditorRenderParams,
  Lazy,
} from '@hydrofoil/shaperone-core/models/components'
import { expect, fixture, html } from '@open-wc/testing'
import { decorateComponent } from '@hydrofoil/shaperone-core/models/components/lib/decorate'
import { dash } from '@tpluscode/rdf-ns-builders/loose'
import { editorTestParams } from '@shaperone/testing'
import clownface from 'clownface'
import $rdf from 'rdf-ext'
import { SingleEditorComponent } from '../index'

describe('core/models/components/lib/decorate', () => {
  describe('decorateComponent', () => {
    let actions: SingleEditorActions
    let params: SingleEditorRenderParams

    interface TestComponent extends SingleEditorComponent {
      name?: string
    }

    const decorator: ComponentDecorator<TestComponent> = {
      applicableTo: () => true,
      decorate(component) {
        return {
          ...component,
          class: 'decor',
          _decorateRender(render) {
            return function (params, actions) {
              return html`<div class="${this.class}">${render(params, actions)}</div>`
            }
          },
        }
      },
    }

    beforeEach(() => {
      ({ actions, params } = editorTestParams({
        object: clownface({ dataset: $rdf.dataset() }).blankNode(),
      }))
    })

    describe('decorating non-lazy component', () => {
      it('wraps the render function', async () => {
        // given
        const component: TestComponent = {
          editor: dash.Foo,
          render() {
            return html`real render`
          },
        }
        // when
        const decorated = decorateComponent(component, decorator)
        const result = await fixture(decorated.render(params, actions))

        // then
        expect(result.classList.contains('decor')).to.be.true
        expect(result.textContent).to.eq('real render')
      })

      it('keeps component context', async () => {
        // given
        const component: TestComponent = {
          editor: dash.Foo,
          name: 'World',
          render() {
            return html`Hello ${this.name}!`
          },
        }
        // when
        const decorated = decorateComponent(component, decorator)
        const result = await fixture(decorated.render(params, actions))

        // then
        expect(result.classList.contains('decor')).to.be.true
        expect(result.textContent).to.eq('Hello World!')
      })
    })

    describe('decorating lazy component', () => {
      it('wraps the render function', async () => {
        // given
        const component: Lazy<SingleEditorComponent> = {
          editor: dash.Foo,
          async lazyRender() {
            return () => html`real render`
          },
        }
        // when
        const decorated = decorateComponent(component, decorator)
        const initialized = {
          ...decorated,
          render: await decorated.lazyRender(),
        }
        const result = await fixture(initialized.render(params, actions))

        // then
        expect(result.classList.contains('decor')).to.be.true
        expect(result.textContent).to.eq('real render')
      })

      it('keeps component render context', async () => {
        // given
        const component: Lazy<TestComponent> = {
          editor: dash.Foo,
          name: 'Lazy World',
          async lazyRender() {
            return function () {
              return html`Hello ${this.name}!`
            }
          },
        }
        // when
        const decorated = decorateComponent(component, decorator)
        const initialized = {
          ...decorated,
          render: await decorated.lazyRender(),
        }
        const result = await fixture(initialized.render(params, actions))

        // then
        expect(result.classList.contains('decor')).to.be.true
        expect(result.textContent).to.eq('Hello Lazy World!')
      })
    })
  })
})
