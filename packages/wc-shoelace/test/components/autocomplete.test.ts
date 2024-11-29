import { expect, fixture } from '@open-wc/testing'
import { dash, rdfs, schema } from '@tpluscode/rdf-ns-builders'
import $rdf from '@shaperone/testing/env.js'
import { editorTestParams } from '@shaperone/testing'
import type { AutoComplete } from '@hydrofoil/shaperone-core/components.js'
import type { SlIconButton } from '@shoelace-style/shoelace'
import type { AutoCompleteEditor } from '../../components/autocomplete.js'
import { autocomplete } from '../../components/autocomplete.js'
import type { ShSlAutocomplete } from '../../elements/sh-sl-autocomplete.js'

describe('wc-shoelace/components/autocomplete', () => {
  let component: AutoCompleteEditor

  beforeEach(async () => {
    component = {
      ...autocomplete,
      render: await autocomplete.lazyRender(),
    }
  })

  it('implements dash:AutoCompleteEditor', () => {
    expect(autocomplete.editor).to.deep.eq(dash.AutoCompleteEditor)
  })

  it('uses rdfs:label as default display property of selected item', async () => {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const selected = $rdf.clownface({ dataset: $rdf.dataset() })
      .blankNode()
      .addOut(rdfs.label, 'Selected Label')
    const { params, actions } = editorTestParams<AutoComplete>({
      object: graph.literal(''),
      componentState: {
        selected,
      },
    })

    // when
    const result = await fixture<ShSlAutocomplete>(component.render(params, actions))

    // then
    expect(result.inputValue).to.eq('Selected Label')
  })

  it('is readonly when dash:readOnly true', async () => {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams<AutoComplete>({
      property: {
        readOnly: true,
      },
      object: graph.literal(''),
    })

    // when
    const result = await fixture<ShSlAutocomplete>(component.render(params, actions))

    // then
    expect(result.readonly).to.be.true
  })

  it('sets loading attribute', async () => {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams<AutoComplete>({
      object: graph.literal(''),
      componentState: {
        loading: true,
      },
    })

    // when
    const result = await fixture<ShSlAutocomplete>(component.render(params, actions))

    // then
    expect(result).to.have.attr('loading')
  })

  it('uses form settings for item labels', async () => {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const {
      params,
      actions,
    } = editorTestParams<AutoComplete>({
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

  it('uses form settings for selected label', async () => {
    // given
    const graph = $rdf.clownface({ dataset: $rdf.dataset() })
    const selected = graph.namedNode('http://example.com/A').addOut(schema.name, 'Ą')
    const {
      params,
      actions,
    } = editorTestParams<AutoComplete>({
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

  context('property sh1:clearable true', () => {
    it('clears selection when icon clicked', async () => {
      // given
      const graph = $rdf.clownface({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams<AutoComplete>({
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

    it('does not show clear button when there is no value', async () => {
      // given
      const graph = $rdf.clownface({ dataset: $rdf.dataset() })
      const { params, actions } = editorTestParams<AutoComplete>({
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
