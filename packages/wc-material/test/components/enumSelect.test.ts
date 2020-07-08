import { expect, fixture } from '@open-wc/testing'
import cf from 'clownface'
import $rdf from '@rdfjs/dataset'
import { sh } from '@tpluscode/rdf-ns-builders'
import { editorTestParams } from '../util'
import { enumSelect } from '../../components/enumSelect'

describe('wc-material/components/enumSelect', () => {
  it('renders an mwc-select', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      object: graph.literal(''),
    })
    params.property.shape._selfGraph.addList(sh.in, ['foo', 'bar'])

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
    })
    params.property.shape._selfGraph.addList(sh.in, ['foo', 'bar'])

    // when
    const result = await fixture(enumSelect.render(params, actions))

    // then
    expect(result).to.equalSnapshot()
  })
})
