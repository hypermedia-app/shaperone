import { expect, fixture } from '@open-wc/testing'
import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { sh } from '@tpluscode/rdf-ns-builders'
import { editorTestParams } from '@shaperone/testing'
import { enumSelect } from '../../components/enumSelect'

describe('wc-material/components/enumSelect', () => {
  it('renders an mwc-select', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      object: graph.literal(''),
    })
    params.property.shape.pointer.addList(sh.in, ['foo', 'bar'])

    // when
    const result = await fixture(enumSelect(params, actions))

    // then
    expect(result).to.equalSnapshot()
  })

  it('sets selection to current object', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      object: graph.literal('bar'),
    })
    params.property.shape.pointer.addList(sh.in, ['foo', 'bar'])

    // when
    const result = await fixture(enumSelect(params, actions))

    // then
    expect(result).to.equalSnapshot()
  })
})
