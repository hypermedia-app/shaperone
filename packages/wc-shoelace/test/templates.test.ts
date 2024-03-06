import { expect, fixture, html } from '@open-wc/testing'
import { testPropertyState } from '@shaperone/testing/models/form.js'
import { propertyRenderer } from '@shaperone/testing/renderer.js'
import { blankNode } from '@shaperone/testing/nodeFactory.js'
import { dash, sh } from '@tpluscode/rdf-ns-builders'
import { sinon } from '@shaperone/testing'
import * as template from '../templates.js'
import { settings } from '../settings.js'

describe('wc-shoelace/templates', () => {
  describe('property', () => {
    context('with custom add-object template', () => {
      it('renders the custom template to section', async () => {
        // given
        const focusNode = blankNode()
        const property = testPropertyState()
        const renderer = propertyRenderer({
          property,
          focusNode,
        })
        renderer.context.templates.shoelace = {
          addObject() {
            return html`<foo-bar></foo-bar>`
          },
        }

        // when
        const el = await fixture(template.property(renderer, { property }))

        // then
        expect(el.querySelector('section[slot=add-object]')).lightDom.to.eq('<foo-bar></foo-bar>')
      })

      it('forwards overrides to action', async () => {
        // given
        const focusNode = blankNode()
        const property = testPropertyState()
        const renderer = propertyRenderer({
          property,
          focusNode,
        })
        const overrides = blankNode()
        settings.newFieldDefaults.foo = 'bar'
        function simulateAdd(e: Event) {
          e.target!.dispatchEvent(new CustomEvent('added', {
            composed: true,
            bubbles: true,
            detail: {
              overrides,
            },
          }))
        }
        renderer.context.templates.shoelace = {
          addObject() {
            return html`<button @click="${simulateAdd}"></button>`
          },
        }

        // when
        const el = await fixture(template.property(renderer, { property }))
        el.querySelector('button')?.click()

        // then
        expect(renderer.actions.addObject).to.have.been.calledWith(sinon.match({
          overrides,
        }))
      })

      it('applies defaults to component state', async () => {
        // given
        const focusNode = blankNode()
        const property = testPropertyState()
        const renderer = propertyRenderer({
          property,
          focusNode,
        })
        settings.newFieldDefaults.foo = 'bar'
        function simulateAdd(e: Event) {
          e.target!.dispatchEvent(new CustomEvent('added', {
            composed: true,
            bubbles: true,
            detail: {
              editor: dash.EnumSelectEditor,
              nodeKind: sh.Literal,
            },
          }))
        }
        renderer.context.templates.shoelace = {
          addObject() {
            return html`<button @click="${simulateAdd}"></button>`
          },
        }

        // when
        const el = await fixture(template.property(renderer, { property }))
        el.querySelector('button')?.click()

        // then
        expect(renderer.actions.addObject).to.have.been.calledWith(sinon.match({
          componentState: {
            foo: 'bar',
          },
        }))
      })
    })
  })
})
