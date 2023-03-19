import { expect, fixture } from '@open-wc/testing'
import cf from 'clownface'
import $rdf from '@rdfjs/dataset'
import { editorTestParams } from '@shaperone/testing'
import { EnumSelect, EnumSelectEditor } from '@hydrofoil/shaperone-core/components'
import { Select } from '@material/mwc-select'
import { rdfs } from '@tpluscode/rdf-ns-builders'
import { enumSelectEditor } from '../../components'

describe('wc-material/components/enumSelect', () => {
  let enumSelect: EnumSelectEditor

  before(async () => {
    enumSelect = {
      ...enumSelectEditor,
      render: await enumSelectEditor.lazyRender(),
    }
  })

  it('renders an mwc-select', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams<EnumSelect>({
      object: graph.literal(''),
      componentState: {
        choices: [
          graph.literal('foo').addOut(rdfs.label, 'foo'),
          graph.literal('bar').addOut(rdfs.label, 'bar'),
        ],
      },
    })

    // when
    const result = await fixture<Select>(enumSelect.render(params, actions))

    // then
    expect(result.items.map(i => i.value)).to.deep.equal(['foo', 'bar'])
  })

  it('sets selection to current object', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams<EnumSelect>({
      object: graph.literal('bar'),
      componentState: {
        choices: [
          graph.literal('foo').addOut(rdfs.label, 'foo'),
          graph.literal('bar').addOut(rdfs.label, 'bar'),
        ],
      },
    })

    // when
    const result = await fixture<Select>(enumSelect.render(params, actions))

    // then
    expect(result.selected?.value).to.eq('bar')
  })
})
