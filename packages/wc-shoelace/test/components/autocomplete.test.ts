import { expect, fixture } from '@open-wc/testing'
import { dash, rdfs, schema } from '@tpluscode/rdf-ns-builders'
import $rdf from '@shaperone/testing/env.js'
import { editorTestParams } from '@shaperone/testing'
import type { SlIconButton } from '@shoelace-style/shoelace'
import defineComponent from '@hydrofoil/shaperone-wc/test/defineComponent.js'
import { AutoComplete } from '../../components.js'

describe('wc-shoelace/components/autocomplete', function () {
  beforeEach(defineComponent(AutoComplete, { awaitEvent: 'sh1-ready' }))

  it('implements dash:AutoCompleteEditor', function () {
    expect(AutoComplete.editor).to.deep.eq(dash.AutoCompleteEditor)
  })

  it('uses rdfs:label as default display property of selected item', async function () {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const selected = $rdf.clownface({ dataset: $rdf.dataset() })
      .blankNode()
      .addOut(rdfs.label, 'Selected Label')
    const params = editorTestParams({
      object: graph.literal(''),
    })

    // when
    const result = await this.component.render(params)

    // then
    expect(result.inputValue).to.eq('Selected Label')
  })

  it('is readonly when dash:readOnly true', async function () {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const params = editorTestParams({
      property: {
        readOnly: true,
      },
      object: graph.literal(''),
    })

    // when
    const result = await this.component.render(params)

    // then
    expect(result.readonly).to.be.true
  })

  it('sets loading attribute', async function () {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const params = editorTestParams({
      object: graph.literal(''),
      componentState: {
        loading: true,
      },
    })

    // when
    const result = await this.component.render(params)

    // then
    expect(result).to.have.attr('loading')
  })

  it('uses form settings for item labels', async function () {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const params = editorTestParams({
      componentState: {
        instances: [
          graph.namedNode('http://example.com/A').addOut(schema.name, 'Ą'),
        ],
      },
      object: graph.namedNode('http://example.com/A'),
    })
    params.form.labelProperties = [schema.name]

    // when
    const result = await fixture<ShSlAutocomplete>(component.render(params, actions))

    // then
    expect(result.querySelector('sl-option')?.textContent).to.eq('Ą')
  })

  it('uses form settings for selected label', async function () {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const selected = graph.namedNode('http://example.com/A').addOut(schema.name, 'Ą')
    const params = editorTestParams({
      componentState: {
        selected,
      },
      object: selected,
    })
    params.form.labelProperties = [schema.name]

    // when
    const result = await fixture<ShSlAutocomplete>(component.render(params, actions))

    // then
    expect(result.inputValue).to.eq('Ą')
  })

  context('property sh1:clearable true', function () {
    it('clears selection when icon clicked', async function () {
      // given
      const graph = $rdf.clownface({ dataset: $rdf.dataset() })
      const params = editorTestParams({
        property: {
          [$rdf.ns.sh1.clearable.value]: true,
        },
        componentState: {
          instances: [
            graph.literal('A'),
            graph.literal('B'),
            graph.literal('C'),
          ],
        },
        object: graph.literal('B'),
      })

      // when
      const editor = await fixture<ShSlAutocomplete>(component.render(params, actions))
      editor.renderRoot.querySelector<SlIconButton>('#clear')?.click()

      // then
      expect(actions.clear).to.have.been.calledOnce
      expect(editor.renderRoot.querySelector('sl-dropdown')).to.have.property('open', false)
    })

    it('does not show clear button when there is no value', async function () {
      // given
      const graph = $rdf.clownface({ dataset: $rdf.dataset() })
      const params = editorTestParams({
        property: {
          [$rdf.ns.sh1.clearable.value]: true,
        },
        componentState: {
          instances: [
            graph.literal('A'),
          ],
        },
        object: undefined,
      })

      // when
      const editor = await fixture<ShSlAutocomplete>(component.render(params, actions))
      const clearButton = editor.renderRoot.querySelector('#clear')

      // then
      expect(getComputedStyle(clearButton!).display).to.eq('none')
    })
  })
})
