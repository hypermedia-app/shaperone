import { fixture, expect } from '@open-wc/testing'
import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { urlEditor } from '../../components/urlEditor'
import { editorTestParams } from '../util'

describe('wc-material/components/urlEditor', () => {
  it('renders field[type=url]', async () => {
    // given
    const graph = cf({ dataset: $rdf.dataset() })
    const { params, actions } = editorTestParams({
      object: graph.namedNode('foo-bar'),
    })

    // when
    const element = await fixture(urlEditor.render(params, actions))

    // then
    expect(element).to.equalSnapshot()
  })
})
