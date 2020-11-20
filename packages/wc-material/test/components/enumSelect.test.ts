import { expect, fixture } from '@open-wc/testing'
import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { editorTestParams } from '@shaperone/testing'
import { EnumSelectEditor } from '@hydrofoil/shaperone-core/components'
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
    const { params, actions } = editorTestParams({
      object: graph.literal(''),
      componentState: {
        choices: [
          graph.literal('foo'),
          graph.literal('bar'),
        ],
      },
    })

    // when
    const result = await fixture(enumSelect.render(params, actions))

    // then
    expect(result).to.equalSnapshot()
  })

  it('sets selection to current object', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      object: graph.literal('bar'),
      componentState: {
        choices: [
          graph.literal('foo'),
          graph.literal('bar'),
        ],
      },
    })

    // when
    const result = await fixture(enumSelect.render(params, actions))

    // then
    expect(result).to.equalSnapshot()
  })
})
