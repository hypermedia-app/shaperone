import cf from 'clownface'
import $rdf from '@rdf-esm/dataset'
import { expect, fixture } from '@open-wc/testing'
import { editorTestParams } from '../util'
import { urlEditor } from '../../components/url-editor'

describe('wc-vaadin/components/url-editor', () => {
  it('renders text field', async () => {
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
