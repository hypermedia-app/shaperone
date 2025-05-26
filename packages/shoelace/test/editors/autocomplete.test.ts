import { expect, oneEvent } from '@open-wc/testing'
import { dash, owl, rdf, rdfs, schema } from '@tpluscode/rdf-ns-builders'
import $rdf from '@shaperone/testing/env.js'
import { editorTestParams } from '@shaperone/testing'
import defineComponent from 'shaperone/test/defineComponent.js'
import { setEnv } from '@shaperone/core/env.js'
import { AutoComplete } from '../../components.js'

describe('wc-shoelace/components/autocomplete', function () {
  before(function () {
    setEnv($rdf)
  })

  beforeEach(defineComponent(AutoComplete, { awaitEvent: 'sh1-ready' }))

  it('implements dash:AutoCompleteEditor', function () {
    expect(AutoComplete.editor).to.deep.eq(dash.AutoCompleteEditor)
  })

  it('uses rdfs:label as default display property of selected item', async function () {
    // given
    const graph = $rdf.clownface()
      .blankNode()
      .addOut(rdf.type, owl.Thing)
      .addOut(rdfs.label, 'Selected Label')
    const params = editorTestParams({
      graph,
      property: {
        class: owl.Thing,
      },
      object: graph.term,
    })

    // when
    const { input } = await this.component.render(params, {
      element: 'sl-input',
    })

    // then
    expect(input.value).to.eq('Selected Label')
  })

  it('is readonly when dash:readOnly true', async function () {
    // given
    const params = editorTestParams({
      property: {
        readOnly: true,
      },
    })

    // when
    const { input } = await this.component.render(params, {
      element: 'sl-dropdown',
    })

    // then
    expect(input.disabled).to.be.true
  })

  it('sets loading attribute', async function () {
    // given
    const params = editorTestParams<AutoComplete>({
      loading: true,
    })

    // when
    const result = await this.component.render(params)

    // then
    expect(result).to.have.attr('loading')
  })

  it('uses form settings for item labels', async function () {
    // given
    const graph = $rdf.clownface()
    graph
      .namedNode('http://example.com/A')
      .addOut(rdf.type, owl.Thing)
      .addOut(schema.name, 'Ą')
    const params = editorTestParams<AutoComplete>({
      graph,
      property: {
        class: owl.Thing,
      },
      labelProperties: [schema.name],
    })

    // when
    const editor = await this.component.render(params)
    setTimeout(() => {
      const input = editor.shadowRoot!.querySelector('sl-input')!
      input.value = 'Ą'
      input.dispatchEvent(new CustomEvent('sl-input'))
    })
    await oneEvent(editor, 'search-completed')

    // then
    const menu = editor.shadowRoot!.querySelector('sl-menu')!
    expect(menu.querySelector('sl-menu-item')?.textContent?.trim()).to.eq('Ą')
  })

  it('uses form settings for selected label', async function () {
    // given
    const graph = $rdf.clownface()
    graph
      .namedNode('http://example.com/A')
      .addOut(rdf.type, owl.Thing)
      .addOut(schema.name, 'Ą')
    const params = editorTestParams({
      graph,
      property: {
        class: owl.Thing,
      },
      object: $rdf.namedNode('http://example.com/A'),
      labelProperties: [schema.name],
    })

    // when
    const { input } = await this.component.render(params, {
      element: 'sl-input',
    })

    // then
    expect(input.value).to.eq('Ą')
  })

  context('property sh1:clearable true', function () {
    it('clears selection when icon clicked', async function () {
      // given
      const graph = $rdf.clownface()
      graph
        .namedNode('http://example.com/A')
        .addOut(rdf.type, owl.Thing)
        .addOut(rdfs.label, 'A')
      const params = editorTestParams({
        graph,
        property: {
          class: owl.Thing,
          [$rdf.ns.sh1.clearable.value]: true,
        },
        object: $rdf.namedNode('http://example.com/A'),
      })

      // when
      const { component, input } = await this.component.render(params, {
        element: 'sl-icon-button',
      })
      expect(component.shadowRoot!.querySelector('sl-input')).to.have.property('value', 'A')
      setTimeout(() => {
        input.click()
      })
      await oneEvent(component, 'cleared')
      await component.updateComplete

      // then
      expect(component.renderRoot.querySelector('sl-dropdown')).to.have.property('open', false)
      expect(component.renderRoot.querySelector('sl-input')).to.have.property('value', '')
    })

    it('does not show clear button when there is no value', async function () {
      // given
      const params = editorTestParams({
        property: {
          [$rdf.ns.sh1.clearable.value]: true,
        },
      })

      // when
      const { input } = await this.component.render(params, {
        element: 'sl-icon-button',
      })

      // then
      expect(input).to.be.null
    })
  })
})
