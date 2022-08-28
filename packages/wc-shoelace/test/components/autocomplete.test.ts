import { expect, fixture } from '@open-wc/testing'
import { dash, rdfs } from '@tpluscode/rdf-ns-builders'
import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { editorTestParams } from '@shaperone/testing'
import { AutoComplete } from '@hydrofoil/shaperone-core/components'
import { autocomplete, AutoCompleteEditor } from '../../components/autocomplete.js'
import { ShSlAutocomplete } from '../../elements/sh-sl-autocomplete'

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
    const graph = cf({ dataset: $rdf.dataset() })
    const selected = cf({ dataset: $rdf.dataset() })
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
})
