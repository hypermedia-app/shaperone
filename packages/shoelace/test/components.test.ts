import $rdf from '@shaperone/testing/env.js'
import { editorTestParams } from '@shaperone/testing'
import { expect, oneEvent } from '@open-wc/testing'
import { xsd } from '@tpluscode/rdf-ns-builders'
import defineComponent from 'shaperone/test/defineComponent.js'
import { setEnv } from '@shaperone/core/env.js'
import * as components from '../components.js'

describe('wc-shoelace/components', function () {
  before(function () {
    setEnv($rdf)
  })

  describe('textField', function () {
    beforeEach(defineComponent(components.TextField, { awaitEvent: 'sh1-ready' }))

    it('is readonly when dash:readOnly true', async function () {
      // given
      const graph = $rdf.clownface()
      const params = editorTestParams({
        property: {
          readOnly: true,
        },
        object: graph.namedNode(''),
      })

      // when
      const { input } = await this.component.render(params, {
        element: 'sl-input',
      })

      // then
      expect(input.readonly).to.be.true
    })
  })

  describe('textFieldWithLang', function () {
    beforeEach(defineComponent(components.TextFieldWithLang, { awaitEvent: 'sh1-ready' }))

    it('is readonly when dash:readOnly true', async function () {
      // given
      const graph = $rdf.clownface()
      const params = editorTestParams({
        property: {
          readOnly: true,
        },
        object: graph.namedNode(''),
      })

      // when
      const { input } = await this.component.render(params, {
        element: 'sl-input',
      })

      // then
      expect(input.readonly).to.be.true
    })
  })

  describe('uri', function () {
    beforeEach(defineComponent(components.Uri, { awaitEvent: 'sh1-ready' }))

    it('is readonly when dash:readOnly true', async function () {
      // given
      const graph = $rdf.clownface()
      const params = editorTestParams({
        property: {
          readOnly: true,
        },
        object: graph.namedNode(''),
      })

      // when
      const { input } = await this.component.render(params, {
        element: 'sl-input',
      })

      // then
      expect(input.readonly).to.be.true
    })
  })

  describe('boolean', function () {
    beforeEach(defineComponent(components.BooleanSelect, { awaitEvent: 'sh1-ready' }))

    it('is disabled when dash:readOnly true', async function () {
      // given
      const params = editorTestParams({
        property: {
          readOnly: true,
        },
      })

      // when
      const { input } = await this.component.render(params, {
        element: 'sl-checkbox',
      })

      // then
      expect(input.disabled).to.be.true
    })

    it('updates when checked', async function () {
      // given
      const graph = $rdf.clownface()
      const params = editorTestParams({
        object: graph.node($rdf.literal('false', xsd.boolean)),
      })

      // when
      const { component, input } = await this.component.render(params, {
        element: 'sl-checkbox',
      })
      setTimeout(() => input.click())

      // then
      const { detail } = await oneEvent(component, 'value-changed')
      expect(detail.value).to.eq($rdf.constant.TRUE)
    })

    it('updates when unchecked', async function () {
      // given
      const graph = $rdf.clownface()
      const params = editorTestParams({
        object: graph.node($rdf.literal('true', xsd.boolean)),
      })

      // when
      const { component, input } = await this.component.render(params, {
        element: 'sl-checkbox',
      })
      setTimeout(() => input.click())

      // then
      const { detail } = await oneEvent(component, 'value-changed')
      expect(detail.value).to.eq($rdf.constant.FALSE)
    })

    it('is checked when value is "true"^^xsd:boolean', async function () {
      // given
      const graph = $rdf.clownface()
      const params = editorTestParams({
        object: graph.node($rdf.literal('true', xsd.boolean)),
      })

      // when
      const result = await this.component.render(params)
      const input = result.shadowRoot!.querySelector('sl-checkbox')!

      // then
      expect(input.checked).to.be.true
      expect(input.indeterminate).to.be.false
    })

    it('is unchecked when value is "false"^^xsd:boolean', async function () {
      // given
      const graph = $rdf.clownface()
      const params = editorTestParams({
        object: graph.node($rdf.literal('false', xsd.boolean)),
      })

      // when
      const { input } = await this.component.render(params, {
        element: 'sl-checkbox',
      })

      // then
      expect(input.checked).to.be.false
      expect(input.indeterminate).to.be.false
    })

    it('is indeterminate and unchecked when unset', async function () {
      // given
      const params = editorTestParams()

      // when
      const { input } = await this.component.render(params, {
        element: 'sl-checkbox',
      })

      // then
      expect(input.checked).to.be.false
      expect(input.indeterminate).to.be.true
    })
  })
})
