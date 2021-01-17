import { expect, fixture } from '@open-wc/testing'
import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { editorTestParams } from '@shaperone/testing'
import { EnumSelect, EnumSelectEditor } from '@hydrofoil/shaperone-core/components'
import { Select } from '@material/mwc-select'
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
          [graph.literal('foo'), 'foo'],
          [graph.literal('bar'), 'bar'],
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
          [graph.literal('foo'), 'foo'],
          [graph.literal('bar'), 'bar'],
        ],
      },
    })

    // when
    const result = await fixture<Select>(enumSelect.render(params, actions))

    // then
    expect(result.selected?.value).to.eq('bar')
  })
})
